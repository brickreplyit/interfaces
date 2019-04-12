/**
 * GLOBAL SETTINGS SECTION
 */
const _ = require('lodash');
const config = require('../../../config');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

global.gConfig = _.merge(config['global'], environmentConfig);

/**
 * LOGGER
 */
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

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    MQTT_LOGGER
    , SYSTEM_LOGGER
    , Sleep
};