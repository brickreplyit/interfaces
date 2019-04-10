const log4js = require('log4js');

log4js.configure({
    appenders: { 
        mqtt: { 
            type: 'file'
            , filename: 'logs/mqtt.log' 
        } 
        , system : { 
            type: 'file'
            , filename: 'logs/system.log' 
        }
    }
    ,categories: { 
        default: { appenders: ['system', 'mqtt'], level: 'info' } 
    }
});

const SYSTEM_LOGGER = log4js.getLogger('system');
const MQTT_LOGGER = log4js.getLogger('mqtt');

module.exports = {
    MQTT_LOGGER
    , SYSTEM_LOGGER
};