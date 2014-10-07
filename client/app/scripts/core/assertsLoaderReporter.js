define([], function() {
    'use strict';
    function AssetsLoaderReporter(loader, onCompleteCallback) {
        this.htmlElement = document.createElement('div');
        this.htmlElement.appendChild(document.createTextNode('Loading assets...'));
        this.progress = this.htmlElement.appendChild(document.createElement('progress'));
        document.body.appendChild(this.htmlElement);
        loader.progressCallback = this.reportProgress.bind(this);
        loader.completeCallback = this.onComplete.bind(this);
        this.onCompleteCallback = onCompleteCallback;
        this.start = loader.startLoad.bind(loader);
    }
    AssetsLoaderReporter.prototype.reportProgress = function(progressEvent) {
        this.progress.value = progressEvent.progress;
    };

    AssetsLoaderReporter.prototype.onComplete = function() {
        document.body.removeChild(this.htmlElement);
        if(this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    };

    return AssetsLoaderReporter;
});
