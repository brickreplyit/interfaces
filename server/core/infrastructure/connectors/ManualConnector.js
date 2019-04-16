const Storage = require('../../Index').MongoDBStorage;

class ManualConnector{

    constructor(MQTT_BROKER, whoIam, db_conn_string){
        this.whoIam = whoIam;
        
        this.MQTT_BROKER = MQTT_BROKER;

        this.DB = new Storage(db_conn_string);

        this.topic_end = `${whoIam}_MANUAL_END`;
    }

    Start(pieces, works_to_execute){
        const message = {
            workId : this.whoIam
            ,pieces
            , works_to_execute
        };

        this.DB.Insert([message], 'ProductionDocument' , 'EW');

        this.MQTT_BROKER.Init([this.topic_end]);
    }

    /**
     * 
     * @param {*} function_to_execute logic for the return message 
     */
    End(function_to_execute){
        this.MQTT_BROKER.RegisterMessageLogic(function_to_execute);
    }

    Destroy(){
        this.MQTT_BROKER.End();
    }
}

module.exports = ManualConnector;