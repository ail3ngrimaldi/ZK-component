# 🛡️ ZK Proof Web Component

[![Generic badge](https://img.shields.io/badge/Midnight%20Network-Enabled-1abc9c.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Zero--Knowledge-Proofs-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Web%20Components-v1-green.svg)](https://shields.io/)

A generic, reusable Web Component for zero-knowledge proof validations on Midnight Network. Enables privacy-preserving verification for any threshold-based requirement in any web application.

## ✨ Features

- 🔒 **Privacy-First**: Your data stays private using zero-knowledge proofs
- ⚡ **Framework Agnostic**: Works with React, Vue, Angular, or plain HTML
- 🎨 **Customizable**: Fully configurable UI, messages, and validation logic
- 📱 **Responsive**: Modern glassmorphism design that adapts to any screen
- 🛡️ **Midnight Network**: Built specifically for Midnight's ZK capabilities
- 🔧 **Easy Integration**: Drop-in component with simple HTML attributes

## 🚀 Quick Start

### Installation

```bash
npm install zk-proof-web-component
```

### Basic Usage

```html
<!-- Simple age verification -->
<zk-proof-validator 
  validation-type="age"
  threshold="18"
  input-label="Enter your age"
  success-message="✅ Age verified!"
  error-message="❌ Must be 18 or older"
  button-text="Verify Age">
</zk-proof-validator>

<script type="module">
  import 'zk-proof-web-component';
  
  // Listen for validation results
  document.addEventListener('zk-validation-success', (event) => {
    console.log('Validation passed!', event.detail);
  });
</script>
```

### React Integration

```tsx
import { useEffect } from 'react';
import 'zk-proof-web-component';

function MyComponent() {
  useEffect(() => {
    const handleSuccess = (event) => {
      console.log('ZK Proof validated!', event.detail);
    };
    
    document.addEventListener('zk-validation-success', handleSuccess);
    return () => document.removeEventListener('zk-validation-success', handleSuccess);
  }, []);

  return (
    <zk-proof-validator 
      validation-type="income"
      threshold="50000"
      input-label="Annual income (USD)"
      success-message="✅ Income qualified!"
      button-text="Verify Income"
    />
  );
}
```

### Vue Integration

```vue
<template>
  <zk-proof-validator 
    validation-type="credit"
    threshold="700"
    input-label="Credit score"
    success-message="✅ Excellent credit!"
    @zk-validation-success="handleSuccess"
  />
</template>

<script setup>
import 'zk-proof-web-component';

const handleSuccess = (event) => {
  console.log('Credit verified!', event.detail);
};
</script>
```

## 📋 Configuration

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `validation-type` | string | `"age"` | Type of validation (age, income, credit, etc.) |
| `threshold` | number | `18` | Minimum value required for validation |
| `input-label` | string | `"Enter your age"` | Label for the input field |
| `success-message` | string | `"✅ Validation successful"` | Message shown on success |
| `error-message` | string | `"❌ Validation failed"` | Message shown on failure |
| `button-text` | string | `"Validate with ZK Proof"` | Text for the validation button |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `zk-validation-success` | `{ validationType, threshold, proof, timestamp }` | Fired when validation passes |
| `zk-validation-error` | `{ validationType, threshold, error, timestamp }` | Fired when validation fails |

### Programmatic API

```javascript
const validator = document.querySelector('zk-proof-validator');

// Validate programmatically
const result = await validator.validate(25);
console.log(result.success); // true/false

// Update configuration
validator.setConfig({
  threshold: 21,
  successMessage: "🎉 You're old enough!",
  validationType: "drinking-age"
});

// Get current configuration
const config = validator.getConfig();
console.log(config.threshold); // 21
```

## 🎯 Use Cases

- **Financial Services**: Loan pre-qualification without credit pulls
- **E-commerce**: Age verification for restricted products
- **Job Platforms**: Experience verification without revealing employers
- **Healthcare**: Symptom verification without revealing medical history
- **Gaming**: Skill level verification for competitive matches
- **Real Estate**: Income verification for rental applications

## 🔧 Development

### Prerequisites

- Node.js 18+ 
- Midnight Lace wallet (for testing)
- Midnight proof server running locally

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/zk-proof-web-component.git
cd zk-proof-web-component

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── core/                     # Core business logic
│   ├── BBoardAPI.ts         # Blockchain API integration
│   ├── WalletConnector.ts   # Midnight wallet connection
│   ├── ZKProofService.ts    # ZK proof generation
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
│
├── components/
│   └── ZKProofWebComponent.ts  # Main Web Component
│
└── index.ts                 # Library entry point
```

## 🌐 Browser Support

- Chrome/Edge 54+
- Firefox 63+
- Safari 10.1+
- All modern browsers with Web Components v1 support

## 📄 License

Apache-2.0 License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 🔗 Links

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Web Components Specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Zero-Knowledge Proofs Explained](https://en.wikipedia.org/wiki/Zero-knowledge_proof)