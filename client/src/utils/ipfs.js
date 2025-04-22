/**
 * Simple IPFS utility for storing and retrieving files
 * Uses public IPFS gateways - no API keys required
 */

/**
 * Convert a file to a data URL that can be stored and displayed
 * This avoids requiring external IPFS services for demo purposes
 * @param {File} file - The file to convert
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Simulate IPFS storage by storing in localStorage
 * In a real app, this would use web3.storage, nft.storage, or Infura IPFS
 * @param {File} file - The file to store
 */
export const storeFile = async (file) => {
  try {
    // Demo implementation that simulates IPFS by using data URLs
    const dataUrl = await fileToDataUrl(file);
    
    // Generate a random hash to simulate an IPFS CID
    const mockCid = 'ipfs-' + Math.random().toString(36).substring(2, 15);
    
    // Store in localStorage for demo purposes
    localStorage.setItem(`ipfs-${mockCid}`, JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
      data: dataUrl,
      timestamp: Date.now()
    }));
    
    // In a real app, we would return an IPFS URL like:
    // return `https://ipfs.io/ipfs/${realCid}/${file.name}`;
    return `demo-ipfs://${mockCid}/${file.name}`;
  } catch (error) {
    console.error('Error storing file:', error);
    throw new Error('Failed to store file');
  }
};

/**
 * Store JSON data
 * @param {Object} json - The JSON data to store
 */
export const storeJson = async (json) => {
  try {
    // Generate a random hash to simulate an IPFS CID
    const mockCid = 'ipfs-' + Math.random().toString(36).substring(2, 15);
    
    // Store in localStorage for demo purposes
    localStorage.setItem(`ipfs-${mockCid}`, JSON.stringify({
      name: 'data.json',
      type: 'application/json',
      data: json,
      timestamp: Date.now()
    }));
    
    return `demo-ipfs://${mockCid}/data.json`;
  } catch (error) {
    console.error('Error storing JSON:', error);
    throw new Error('Failed to store JSON data');
  }
};

/**
 * Retrieve file or JSON from simulated IPFS storage
 * @param {string} url - The IPFS URL
 */
export const retrieveFromIpfs = (url) => {
  if (!url.startsWith('demo-ipfs://')) {
    // In a real app, we would fetch from IPFS gateway
    console.log('Would fetch from IPFS gateway:', url);
    return null;
  }
  
  // Extract the mock CID from the URL
  const parts = url.replace('demo-ipfs://', '').split('/');
  const mockCid = parts[0];
  
  // Retrieve from localStorage
  const storedData = localStorage.getItem(`ipfs-${mockCid}`);
  if (!storedData) return null;
  
  return JSON.parse(storedData);
};

export default {
  storeFile,
  storeJson,
  retrieveFromIpfs
}; 