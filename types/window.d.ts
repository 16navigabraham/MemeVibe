// types/window.d.ts

interface EthereumProvider {
  request: (...args: any[]) => Promise<any>;
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  isMetaMask?: boolean;
  // you can extend this if needed
}

interface Window {
  ethereum?: EthereumProvider;
}
