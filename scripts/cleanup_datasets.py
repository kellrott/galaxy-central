#!/usr/bin/env python2.4

import sys, os, time, ConfigParser
from datetime import datetime, timedelta
from optparse import OptionParser
import galaxy.app
import pkg_resources

pkg_resources.require( "sqlalchemy>=0.3" )
from sqlalchemy import eagerload

def main():
    parser = OptionParser()
    parser.add_option( "-d", "--days", dest="days", action="store", type="int", help="number of days (60)", default=60 )
    parser.add_option( "-r", "--remove_from_disk", action="store_true", dest="remove_from_disk", help="remove datasets from disk when purged", default=False )
    parser.add_option( "-1", "--info_delete_userless_histories", action="store_true", dest="info_delete_userless_histories", default=False, help="info about the histories and datasets that will be affected by delete_userless_histories()" )
    parser.add_option( "-2", "--delete_userless_histories", action="store_true", dest="delete_userless_histories", default=False, help="delete userless histories and datasets" )
    parser.add_option( "-3", "--info_purge_histories", action="store_true", dest="info_purge_histories", default=False, help="info about histories and datasets that will be affected by purge_histories()" )
    parser.add_option( "-4", "--purge_histories", action="store_true", dest="purge_histories", default=False, help="purge deleted histories" )
    parser.add_option( "-5", "--info_purge_datasets", action="store_true", dest="info_purge_datasets", default=False, help="info about the datasets that will be affected by purge_datasets()" )
    parser.add_option( "-6", "--purge_datasets", action="store_true", dest="purge_datasets", default=False, help="purge deleted datasets" )
    ( options, args ) = parser.parse_args()
    ini_file = args[0]
    
    if not ( options.info_delete_userless_histories ^ options.delete_userless_histories ^ \
             options.info_purge_histories ^ options.purge_histories ^ \
             options.info_purge_datasets ^ options.purge_datasets ):
        parser.print_help()
        sys.exit(0)
    
    conf_parser = ConfigParser.ConfigParser( {'here':os.getcwd()} )
    conf_parser.read( ini_file )
    configuration = {}
    for key, value in conf_parser.items( "app:main" ):
        configuration[key] = value
    app = galaxy.app.UniverseApplication( global_conf = ini_file, **configuration )
    h = app.model.History
    d = app.model.Dataset
    cutoff_time = datetime.utcnow() - timedelta( days=options.days )

    print "\n# Handling stuff older than %i days\n" %options.days

    if options.info_delete_userless_histories:
        info_delete_userless_histories( h, cutoff_time )
    elif options.delete_userless_histories:
        delete_userless_histories( h, cutoff_time )
    if options.info_purge_histories:
        info_purge_histories( h, cutoff_time )
    elif options.purge_histories:
        if options.remove_from_disk:
            print "# Datasets will be removed from disk...\n"
        else:
            print "# Datasets will NOT be removed from disk...\n"
        purge_histories( h, cutoff_time, options.remove_from_disk )
    elif options.info_purge_datasets:
        info_purge_datasets( d, cutoff_time )
    elif options.purge_datasets:
        if options.remove_from_disk:
            print "# Datasets will be removed from disk...\n"
        else:
            print "# Datasets will NOT be removed from disk...\n"
        purge_datasets( d, cutoff_time, options.remove_from_disk )
    app.shutdown()
    sys.exit(0)

def info_delete_userless_histories( h, cutoff_time ):
    # Provide info about the histories and datasets that will be affected if the delete_userless_histories function is executed.
    history_count = 0
    dataset_count = 0
    where = ( h.table.c.user_id==None ) & ( h.table.c.deleted=='f' ) & ( h.table.c.update_time < cutoff_time )
    histories = h.query().filter( where ).options( eagerload( 'datasets' ) )

    print '# The following datasets and associated userless histories will be deleted'
    start = time.clock()
    for history in histories:
        for dataset in history.datasets:
            if not dataset.deleted:
                print "dataset_%d" %dataset.id
                dataset_count += 1
        print "%d" % history.id
        history_count += 1
    stop = time.clock()
    print "# %d histories ( including a total of %d datasets ) will be deleted\n" %( history_count, dataset_count )
    print "Elapsed time: ", stop - start, "\n"

def delete_userless_histories( h, cutoff_time ):
    # Deletes userless histories whose update_time value is older than the cutoff_time.
    # The datasets associated with each history are also deleted.  Nothing is removed from disk.
    history_count = 0
    dataset_count = 0
    where = ( h.table.c.user_id==None ) & ( h.table.c.deleted=='f' ) & ( h.table.c.update_time < cutoff_time )

    print '# The following datasets and associated userless histories have been deleted'
    start = time.clock()
    histories = h.query().filter( where ).options( eagerload( 'datasets' ) )
    for history in histories:
        for dataset in history.datasets:
            if not dataset.deleted:
                dataset.deleted = True
                dataset.flush()
                print "dataset_%d" %dataset.id
                dataset_count += 1
        history.deleted = True
        history.flush()
        print "%d" % history.id
        history_count += 1
    stop = time.clock()
    print "# Deleted %d histories ( including a total of %d datasets )\n" %( history_count, dataset_count )
    print "Elapsed time: ", stop - start, "\n"
    
def info_purge_histories( h, cutoff_time ):
    # Provide info about the histories and datasets that will be affected if the purge_histories function is executed.
    history_count = 0
    dataset_count = 0
    disk_space = 0
    where = ( h.table.c.deleted=='t' ) & ( h.table.c.purged=='f' ) & ( h.table.c.update_time < cutoff_time )

    print '# The following datasets and associated deleted histories will be purged'
    start = time.clock()
    histories = h.query().filter( where ).options( eagerload( 'datasets' ) )   
    for history in histories:
        for dataset in history.datasets:
            if not dataset.purged:
                print "%s" % dataset.file_name
                dataset_count += 1
                try:
                    disk_space += dataset.file_size
                except:
                    pass
        print "%d" % history.id
        history_count += 1
    stop = time.clock()
    print '# %d histories ( including a total of %d datasets ) will be purged.  Freed disk space: ' %( history_count, dataset_count ), disk_space, '\n'
    print "Elapsed time: ", stop - start, "\n"

def purge_histories( h, cutoff_time, remove_from_disk ):
    # Purges deleted histories whose update_time is older than the cutoff_time.
    # The datasets associated with each history are also purged.
    history_count = 0
    dataset_count = 0
    disk_space = 0
    file_size = 0
    errors = False
    where = ( h.table.c.deleted=='t' ) & ( h.table.c.purged=='f' ) & ( h.table.c.update_time < cutoff_time )

    print '# The following datasets and associated deleted histories have been purged'
    start = time.clock()
    histories = h.query().filter( where ).options( eagerload( 'datasets' ) )      
    for history in histories:
        for dataset in history.datasets:
            if not dataset.purged:
                if remove_from_disk:
                    file_size = dataset.file_size
                    errmsg = purge_dataset( dataset )
                    if errmsg:
                        errors = True
                        print errmsg
                    else:
                        print "%s" % dataset.file_name
                        dataset_count += 1
                        try:
                            disk_space += file_size
                        except:
                            pass
                else:
                    print "%s" % dataset.file_name
        if not errors:
            history.purged = True
            history.flush()
            print "%d" % history.id
            history_count += 1
    stop = time.clock()
    print '# Purged %d histories ( including a total of %d datasets ).  Freed disk space: ' %( history_count, dataset_count ), disk_space, '\n'
    print "Elapsed time: ", stop - start, "\n"

def info_purge_datasets( d, cutoff_time ):
    # Provide info about the datasets that will be affected if the purge_datasets function is executed.
    dataset_count = 0
    disk_space = 0
    where = ( d.table.c.deleted=='t' ) & ( d.table.c.purged=='f' ) & ( d.table.c.update_time < cutoff_time )

    print '# The following deleted datasets will be purged'    
    start = time.clock()
    datasets = d.query().filter( where )
    for dataset in datasets:
        print "%s" % dataset.file_name
        dataset_count += 1
        try:
            disk_space += dataset.file_size
        except:
            pass
    stop = time.clock()
    print '# %d datasets will be purged.  Freed disk space: ' %dataset_count, disk_space, '\n'
    print "Elapsed time: ", stop - start, "\n"

def purge_datasets( d, cutoff_time, remove_from_disk ):
    # Purges deleted datasets whose update_time is older than cutoff_time.  Files may or may
    # not be removed from disk.
    dataset_count = 0
    disk_space = 0
    file_size = 0
    where = ( d.table.c.deleted=='t' ) & ( d.table.c.purged=='f' ) & ( d.table.c.update_time < cutoff_time )

    print '# The following deleted datasets have been purged'
    start = time.clock()
    datasets = d.query().filter( where )
    for dataset in datasets:
        if remove_from_disk:
            file_size = dataset.file_size
            errmsg = purge_dataset( dataset )
            if errmsg:
                print errmsg
            else:
                print "%s" % dataset.file_name
                try:
                    disk_space += file_size
                except:
                    pass
        else:
            print "%s" % dataset.file_name
        dataset_count += 1
    stop = time.clock()
    print '# %d datasets purged\n' % dataset_count
    if remove_from_disk:
        print '# Freed disk space: ', disk_space, '\n'
    print "Elapsed time: ", stop - start, "\n"

def purge_dataset( dataset ):
    # Removes the file from disk and updates the database accordingly.
    if dataset.dataset_file is None or not dataset.dataset_file.readonly:
        #Check to see if another dataset is using this file
        if dataset.dataset_file:
            for data in dataset.select_by( purged=False, filename_id=dataset.dataset_file.id ):
                if data.id != dataset.id:
                    return "# Error: the dataset id for deletion is %s, while the dataset id retrieved is %s\n" %( str( dataset.id ), str( data.id ) )
        elif dataset.deleted:
            # Remove files from disk and update the database
            try:
                os.unlink( dataset.file_name )
                dataset.purged = True
                dataset.flush()
            except Exception, exc:
                return "# Error, exception: %s caught attempting to purge %s\n" %( str( exc ), dataset.file_name )
            try:
                os.unlink( dataset.extra_files_path )
            except:
                pass
        else:
            return "# Error: '%s' has not previously been deleted, so it cannot be purged\n" %dataset.file_name
    else:
        return "# Error: '%s' has dependencies, so it cannot be purged\n" %dataset.file_name
    return ""

if __name__ == "__main__":
    main()