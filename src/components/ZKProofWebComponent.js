export class ZKProofWebComponent extends HTMLElement {
  constructor() {
      wallet: null;
      super();
      this.attachShadow({ mode: 'open' });
      this.isLoading = false;
      this.proofConfig = {};
  }

  connectedCallback() {
      console.log('✅ ZKProofWebComponent connected!');

      this.contractAddress = this.getAttribute('contract-address');
      this.proofType = this.getAttribute('proof-type');
      this.network = this.getAttribute('network') || 'testnet';

      if (!this.contractAddress) {
          this.renderError('❌ Atributo "contract-address" es obligatorio.');
          return;
      }
      if (!this.proofType) {
          this.proofType = 'custom-proof';
      }

      this.render();
  }

  async generateProof() {
    if (this.isLoading) return;
  
    const input = this.shadowRoot?.querySelector('#proofConfigInput');
    if (!input) return;
  
    const rawValue = input.value.trim();
    if (!rawValue) {
      this.renderError('❌ Por favor, ingresa un valor.');
      return;
    }
  
    this.isLoading = true;
    this.render();
  
    try {
      if (!this.wallet) {
        if (!window.midnight?.lace) {
          throw new Error('Midnight Lace Wallet no encontrada. Instálala en https://lace.io');
        }
        this.wallet = await window.midnight.lace.enable();
        console.log('✅ Wallet conectada:', this.wallet);
      }
  
      // 2. Crear API simple
      const api = new SimpleZKAPI(this.wallet);
  
      // 3. Parsear datos
      let data;
      try {
        data = JSON.parse(rawValue);
      } catch (err) {
        throw new Error('JSON inválido. Usa formato: {"age": 25}');
      }
  
      // 4. Generar y enviar prueba
      const txId = await api.generateAndSendProof(data);
  
      // 5. Emitir evento
      this.dispatchEvent(new CustomEvent('proof-generated', {
        detail: { txId, data },
        bubbles: true,
        composed: true,
      }));
  
      this.renderSuccess(`✅ ¡Prueba ZK enviada! Tx: ${txId.slice(0, 8)}...`);
    } catch (err) {
      console.error('Error:', err);
      this.renderError(`❌ ${err instanceof Error ? err.message : 'Error desconocido'}`);
      this.dispatchEvent(new CustomEvent('error', {
        detail: err instanceof Error ? err.message : 'Error desconocido',
        bubbles: true,
        composed: true,
      }));
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.render();
      }, 3000);
    }
  }

  render() {
      if (!this.shadowRoot) return;

      const buttonText = this.isLoading
          ? 'Generando prueba ZK...'
          : `🔐 Generar Prueba: ${this.proofType}`;

      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  font-family: system-ui, sans-serif;
                  max-width: 500px;
                  margin: 1em 0;
              }
              .container {
                  color: black;
                  background: white;
                  padding: 24px;
                  border-radius: 16px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                  border: 1px solid #e5e7eb;
              }
              h3 {
                  margin: 0 0 16px 0;
                  color: #4f46e5;
              }
              label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: 600;
                  color: #374151;
              }
              textarea {
                  width: 100%;
                  height: 100px;
                  padding: 12px;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  font-family: monospace;
                  font-size: 14px;
                  resize: vertical;
                  margin-bottom: 16px;
                  box-sizing: border-box;
              }
              button {
                  width: 100%;
                  padding: 14px 16px;
                  font-size: 16px;
                  font-weight: 600;
                  border: none;
                  border-radius: 10px;
                  background: linear-gradient(135deg, #7c3aed, #6366f1);
                  color: white;
                  cursor: ${this.isLoading ? 'not-allowed' : 'pointer'};
                  opacity: ${this.isLoading ? '0.85' : '1'};
                  transition: all 0.2s ease;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              button:hover:not(:disabled) {
                  transform: translateY(-1px);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              }
              .status {
                  margin-top: 16px;
                  padding: 14px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-family: monospace;
                  white-space: pre-wrap;
                  word-break: break-all;
              }
              .success {
                  background: #ecfdf5;
                  color: #065f46;
                  border: 1px solid #ccfbf1;
              }
              .error {
                  background: #fef2f2;
                  color: #991b1b;
                  border: 1px solid #fecaca;
              }
              .info {
                  font-size: 12px;
                  color: #6b7280;
                  margin-top: 8px;
              }
              .example {
                  color: black;
                  background: #f9fafb;
                  padding: 12px;
                  border-radius: 6px;
                  font-size: 12px;
                  margin: 8px 0;
              }
          </style>

          <div class="container">
              <h3>🧩 Generador de Pruebas ZK</h3>
              <p>Ingresa la configuración de la prueba que deseas generar (en formato JSON):</p>
              
              <div class="example">
                  Ejemplo para KYC: <br>
                  <code>{"minAge": 21, "country": "AR"}</code>
              </div>

              <textarea 
                  id="proofConfigInput" 
                  placeholder='{"minAge": 18, "country": "US"}'
                  spellcheck="false"
              >${JSON.stringify(this.proofConfig, null, 2) || ''}</textarea>

              <button ${this.isLoading ? 'disabled' : ''}>${buttonText}</button>
              <div class="info">
                  Red: ${this.network} | Tipo: ${this.proofType}
              </div>
              <div id="status" class="status" style="display: none;"></div>
          </div>
      `;

      this.shadowRoot.querySelector('button')?.addEventListener('click', () => this.generateProof());
  }

  renderSuccess(message) {
      this.showStatus(message, 'success');
  }

  renderError(message) {
      this.showStatus(message, 'error');
  }

  showStatus(message, type) {
      const statusDiv = this.shadowRoot?.querySelector('#status');
      if (!statusDiv) return;

      statusDiv.textContent = message;
      statusDiv.className = `status ${type}`;
      statusDiv.style.display = 'block';
  }
}

// Registrar el componente
customElements.define('zk-proof', ZKProofWebComponent);

// // Escuchar eventos del componente
// document.addEventListener('proof-generated', (event) => {
//   console.log('Prueba generada:', event.detail);
// });

// document.addEventListener('error', (event) => {
//   console.error('Error en el componente:', event.detail);
// });