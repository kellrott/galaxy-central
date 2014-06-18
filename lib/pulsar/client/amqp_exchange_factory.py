from .amqp_exchange import PulsarExchange
from .util import filter_destination_params


def get_exchange(url, manager_name, params):
    connect_ssl = parse_amqp_connect_ssl_params(params)
    exchange_kwds = dict(
        manager_name=manager_name,
        connect_ssl=connect_ssl,
        publish_kwds=parse_amqp_publish_kwds(params)
    )
    timeout = params.get('amqp_consumer_timeout', False)
    if timeout is not False:
        exchange_kwds['timeout'] = timeout
    exchange = PulsarExchange(url, **exchange_kwds)
    return exchange


def parse_amqp_connect_ssl_params(params):
    ssl_params = filter_destination_params(params, "amqp_connect_ssl_")
    if not ssl_params:
        return

    ssl = __import__('ssl')
    if 'cert_reqs' in ssl_params:
        value = ssl_params['cert_reqs']
        ssl_params['cert_reqs'] = getattr(ssl, value.upper())
    return ssl_params


def parse_amqp_publish_kwds(params):
    return filter_destination_params(params, "amqp_publish_")
