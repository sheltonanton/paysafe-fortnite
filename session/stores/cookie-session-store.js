const events = require('events');
const session = require('express-session');

let sessionStore = new events.EventEmitter();

let methods = {
    sessions: [],
    all: function(callback){
        callback(null, this.sessions);
    },
    destroy: function(sid, callback){
        try{
            delete this.sessions[sid];
            callback(null);
        }catch(error){
            callback(error);
        }
    },
    clear: function(callback){
        this.sessions = [];
        callback(null);
    },
    length: function(callback){
        try{
            callback(null, this.sessions.length);
        }catch(error){
            callback(error, null);
        }
    },
    get: function(sid, callback){
        try{
            callback(null, this.sessions[sid]);
        }catch(error){
            callback(error, null);
        }
    },
    set: function(sid, session, callback){
        try{
            this.sessions[sid] = session;
            callback(null);
        }catch(error){
            callback(error);
        }
    }
}

//since session store should be an event emitter
sessionStore = Object.assign(sessionStore, methods);

let sessionStoreCreator = {
    getStore: function(){
        return sessionStore;
    }
}

module.exports = sessionStoreCreator;