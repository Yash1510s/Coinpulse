'use server';

// GoPlus Security API endpoint for token security (Ethereum mainnet = chain_id 1)
const GOPLUS_BASE_URL = 'https://api.gopluslabs.io/api/v1/token_security';

export async function getTokenSecurityScore(chainId: string, contractAddress: string) {
  try {
    const res = await fetch(`${GOPLUS_BASE_URL}/${chainId}?contract_addresses=${contractAddress}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) throw new Error('Failed to fetch security data');

    const data = await res.json();

    // GoPlus returns data dynamically based on the address
    const tokenData = data.result?.[contractAddress.toLowerCase()];

    if (!tokenData) {
      return { score: 0, status: 'Unknown', risks: ['Contract data not found'] };
    }

    const risks: string[] = [];
    let score = 100; // Start with a perfect score

    // Threat Detection Logic (Detecting common adversarial contract patterns)
    if (tokenData.is_honeypot === '1') {
      score -= 50;
      risks.push('Honeypot Detected (Cannot sell)');
    }
    if (tokenData.is_mintable === '1') {
      score -= 20;
      risks.push('Owner can mint unlimited tokens');
    }
    if (tokenData.can_take_back_ownership === '1') {
      score -= 20;
      risks.push('Ownership can be reclaimed');
    }
    if (tokenData.transfer_pausable === '1') {
      score -= 10;
      risks.push('Trading can be paused');
    }
    if (tokenData.hidden_owner === '1') {
      score -= 15;
      risks.push('Hidden owner privileges detected');
    }

    // Determine Status
    let status = 'Safe';
    if (score < 50) status = 'Critical Risk';
    else if (score < 80) status = 'Warning';

    return {
      score: Math.max(0, score),
      status,
      risks,
    };
  } catch (error) {
    console.error('Security API Error:', error);
    return { score: 0, status: 'Error', risks: ['Failed to analyze contract'] };
  }
}
