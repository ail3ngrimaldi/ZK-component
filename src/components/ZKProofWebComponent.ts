/**
 * ZKProofWebComponent - Main Web Component for ZK Proof validation
 * Generic, reusable component for any ZK proof validation need
 */

import { ZKProofConfig, ZKProofResult } from '../core/types';
import { Logger } from '../core/utils';

export class ZKProofWebComponent extends HTMLElement {
  private config: ZKProofConfig = {
    validationType: 'age',
    threshold: 18,
    inputLabel: 'Enter your age',
    successMessage: '✅ Validation successful',
    errorMessage: '❌ Validation failed',
    buttonText: 'Validate with ZK Proof'
  };

  private isValidating = false;

  static get observedAttributes(): string[] {
    return [
      'validation-type',
      'threshold',
      'input-label',
      'success-message',
      'error-message',
      'button-text'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    Logger.log('ZK Proof Web Component initialized');
  }

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      const configKey = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof ZKProofConfig;
      (this.config as any)[configKey] = newValue;
      this.render();
    }
  }

  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .zk-container {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }
        
        .zk-title {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }
        
        .zk-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .zk-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .zk-label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }
        
        .zk-input {
          padding: 12px 16px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }
        
        .zk-input:focus {
          outline: none;
          border-color: rgba(102, 126, 234, 0.6);
        }
        
        .zk-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .zk-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .zk-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .zk-loading {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .zk-result {
          margin-top: 16px;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }
        
        .zk-result.success {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid rgba(16, 185, 129, 0.3);
          color: #059669;
        }
        
        .zk-result.error {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }
        
        .zk-privacy {
          margin-top: 12px;
          font-size: 12px;
          text-align: center;
          opacity: 0.7;
          color: #666;
        }
      </style>
      
      <div class="zk-container">
        <div class="zk-title">🛡️ ZK Privacy Validator</div>
        
        <div class="zk-form">
          <div class="zk-input-group">
            <label class="zk-label">${this.config.inputLabel}</label>
            <input 
              type="number" 
              class="zk-input"
              id="zkInput"
              placeholder="Enter value..."
              min="0"
            />
          </div>
          
          <button 
            type="button" 
            class="zk-button" 
            id="zkButton"
            ${this.isValidating ? 'disabled' : ''}
          >
            ${this.isValidating ? 
              '<span class="zk-loading"></span>Generating ZK Proof...' : 
              this.config.buttonText
            }
          </button>
        </div>
        
        <div class="zk-privacy">
          🔒 Your data stays private. Only the validation result is shared via Zero-Knowledge Proof.
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const button = this.shadowRoot?.getElementById('zkButton');
    if (button) {
      button.onclick = (e) => {
        e.preventDefault();
        this.handleValidation();
      };
    }
  }

  private async handleValidation(): Promise<void> {
    const input = this.shadowRoot?.getElementById('zkInput') as HTMLInputElement;
    const value = parseInt(input?.value || '');
    
    if (isNaN(value) || value <= 0) {
      this.showResult('Please enter a valid positive number', 'error');
      return;
    }
    
    this.setValidating(true);
    
    try {
      // TODO: Replace with actual ZK proof generation
      const result = await this.generateZKProof(value, this.config.threshold);
      
      if (result.success) {
        this.showResult(this.config.successMessage, 'success');
        this.dispatchValidationEvent('success', result);
      } else {
        this.showResult(this.config.errorMessage, 'error');
        this.dispatchValidationEvent('error', result);
      }
    } catch (error) {
      Logger.error('ZK validation error:', error);
      this.showResult('Validation failed. Please try again.', 'error');
      this.dispatchValidationEvent('error', { error: (error as Error).message });
    } finally {
      setTimeout(() => this.setValidating(false), 1500);
    }
  }

  private async generateZKProof(value: number, threshold: number): Promise<ZKProofResult> {
    // TODO: Implement actual ZK proof generation with Midnight
    // For now, simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isValid = value >= threshold;
    
    return {
      success: isValid,
      proof: `zk-proof-${Date.now()}-${Math.random().toString(36).substr(2, 12)}`,
      publicResult: isValid ? 1 : 0,
      timestamp: new Date().toISOString(),
      validationType: this.config.validationType,
      threshold
    };
  }

  private setValidating(validating: boolean): void {
    this.isValidating = validating;
    this.render();
    this.attachEventListeners();
  }

  private showResult(message: string, type: 'success' | 'error'): void {
    const existingResult = this.shadowRoot?.querySelector('.zk-result');
    if (existingResult) existingResult.remove();
    
    const result = document.createElement('div');
    result.className = `zk-result ${type}`;
    result.textContent = message;
    
    const container = this.shadowRoot?.querySelector('.zk-container');
    container?.appendChild(result);
  }

  private dispatchValidationEvent(type: 'success' | 'error', data: any): void {
    const event = new CustomEvent(`zk-validation-${type}`, {
      detail: {
        validationType: this.config.validationType,
        threshold: this.config.threshold,
        timestamp: new Date().toISOString(),
        ...data
      },
      bubbles: true,
      composed: true
    });
    
    this.dispatchEvent(event);
  }

  // Public API methods
  public async validate(value: number): Promise<ZKProofResult> {
    return await this.generateZKProof(value, this.config.threshold);
  }

  public setConfig(newConfig: Partial<ZKProofConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.render();
    this.attachEventListeners();
  }

  public getConfig(): ZKProofConfig {
    return { ...this.config };
  }
}

// Register the custom element
if (!customElements.get('zk-proof-validator')) {
  customElements.define('zk-proof-validator', ZKProofWebComponent);
}