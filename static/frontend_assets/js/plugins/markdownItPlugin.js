import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
//import 'highlight.js/styles/github-dark.css'; // Import your desired highlight.js theme
import hljsDefineVue from 'highlightjs-vue';
import 'highlight.js/styles/github-dark.css'
hljsDefineVue(hljs);

export default {
  install(app) {
    const markdown = new MarkdownIt({
      linkify: true,
      breaks: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const highlightedCode = hljs.highlight(str, { language: lang }).value;
            // Add a div or span with the language name above the code block
            return `<pre><div class="code-language">${lang}</div><code class="hljs language-${lang}" data-highlighted="yes">${highlightedCode}</code></pre>`;
          } catch (_) {}
        }
      
        return `<pre><code>${str}</code></pre>`; // Default fallback without highlighting
      }
    });

    app.config.globalProperties.$markdown = markdown;
  }
};