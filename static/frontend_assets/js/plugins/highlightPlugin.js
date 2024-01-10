import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // or your preferred style

export default {
    install(app) {
        app.directive('highlight', {
            // Apply highlighting directly to the bound element
            mounted(el) {
                hljs.highlightElement(el);
            },
            updated(el) {
                hljs.highlightElement(el);
            }
        });
    }
};

