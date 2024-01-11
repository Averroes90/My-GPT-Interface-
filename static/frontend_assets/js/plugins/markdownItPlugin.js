import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Import your desired highlight.js theme
import hljsDefineVue from 'highlightjs-vue';

hljsDefineVue(hljs);




export default {
  install(app) {
    const markdown = new MarkdownIt({
      linkify: true,
      breaks: true,
      highlight: function (str, lang) {
        console.log(`Language detected: ${lang}`);
        console.log(`hljs.getLanguage output:`, hljs.getLanguage(lang));
        if (lang && hljs.getLanguage(lang)) {
            console.log(`inside if: ${lang}`);  
          try {
            console.log(`inside try: ${lang}`);
            return hljs.highlight(str, { language: lang }).value;
          } catch (_) {}
        }

        return ''; // use external default escaping
      }
    });

    app.config.globalProperties.$markdown = markdown;
  }
};