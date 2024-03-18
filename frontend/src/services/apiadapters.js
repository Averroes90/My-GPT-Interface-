export class BaseAdapter {
    constructor() {
      if (new.target === BaseAdapter) {
        throw new TypeError("Cannot construct BaseAdapter instances directly");
      }
      this.requestAdjusters = {
        // Add more API-specific adjusters here
      };
      this.responseAdjusters = {
        '/api/get_interactions/': this.adjustGetInteractionsResponse,
        // Add other endpoint mappings as needed
      };
    }
    adjustResponse(response, url) {
        const endpointKey = this.getEndpointKey(url);
        const adjuster = this.responseAdjusters[endpointKey] || this.defaultResponseAdjuster;
        return adjuster.call(this, response);
      }
      adjustRequest(url, data, config) {
        const endpointKey = this.getEndpointKey(url);
        const adjuster = this.requestAdjusters[endpointKey] || this.defaultRequestAdjuster;
        return adjuster.call(this, url, data, config);
      }
      getEndpointKey(url) {
        return url.split('?')[0];
      }
      defaultResponseAdjuster(response) {
        // Default response adjustment logic
        return response;
      }
    
      adjustGetInteractionsResponse(response) {
        // Placeholder 
        return response;
      }
    
  }
  
  export class FlaskAdapter extends BaseAdapter {
    constructor() {
        super();
      }
      adjustGetInteractionsResponse(response) {
        // Override this method to implement Flask-specific logic
        return response 
      }
  }

  export class FastAPIAdapter extends BaseAdapter {
    constructor() {
        super();
      }
    adjustRequest(url, data, config) {
      // FastAPI-specific request adjustment logic here
      return { url, data, config };
    }
  
    adjustResponse(response) {
      // FastAPI-specific response adjustment logic here
      return response;
    }
    adjustGetInteractionsResponse(response) {
        const interactions = response.interactions
        const total_tokens = response.total_tokens

        return {
            'interactions': interactions,
            'total_tokens': total_tokens}
      }
  }

  // Adapter factory to instantiate the correct adapter based on environment or configuration
export class AdapterFactory {
    static getAdapter(adapterType) {
      switch (adapterType) {
        case 'Flask':
          return new FlaskAdapter();
        case 'FastAPI':
          return new FastAPIAdapter();
        default:
          throw new Error(`Unknown adapter type: ${adapterType}`);
      }
    }
  }