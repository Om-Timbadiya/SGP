// import CryptoJS from 'crypto-js';

// interface Block {
//   timestamp: number;
//   data: any;
//   previousHash: string;
//   hash: string;
// }

// class AssessmentBlockchain {
//   private chain: Block[];

//   constructor() {
//     this.chain = [this.createGenesisBlock()];
//   }

//   private createGenesisBlock(): Block {
//     return {
//       timestamp: Date.now(),
//       data: 'Genesis Block',
//       previousHash: '0',
//       hash: '0',
//     };
//   }

//   private calculateHash(timestamp: number, data: any, previousHash: string): string {
//     const dataString = timestamp + JSON.stringify(data) + previousHash;
//     return CryptoJS.SHA256(dataString).toString();
//   }

//   addBlock(data: any): void {
//     const previousBlock = this.chain[this.chain.length - 1];
//     const timestamp = Date.now();
//     const previousHash = previousBlock.hash;
//     const hash = this.calculateHash(timestamp, data, previousHash);

//     this.chain.push({
//       timestamp,
//       data,
//       previousHash,
//       hash,
//     });
//   }

//   verifyAssessment(assessmentId: string): boolean {
//     const block = this.chain.find(b => b.data?.assessmentId === assessmentId);
//     if (!block) return false;

//     const calculatedHash = this.calculateHash(
//       block.timestamp,
//       block.data,
//       block.previousHash
//     );

//     return calculatedHash === block.hash;
//   }

//   getAssessmentRecord(assessmentId: string): any {
//     return this.chain.find(b => b.data?.assessmentId === assessmentId)?.data;
//   }

//   getChain(): Block[] {
//     return [...this.chain];
//   }

//   isChainValid(): boolean {
//     for (let i = 1; i < this.chain.length; i++) {
//       const currentBlock = this.chain[i];
//       const previousBlock = this.chain[i - 1];

//       // Verify hash
//       const calculatedHash = this.calculateHash(
//         currentBlock.timestamp,
//         currentBlock.data,
//         currentBlock.previousHash
//       );
      
//       if (currentBlock.hash !== calculatedHash) {
//         return false;
//       }

//       // Verify chain linkage
//       if (currentBlock.previousHash !== previousBlock.hash) {
//         return false;
//       }
//     }
//     return true;
//   }
// }

// export const assessmentBlockchain = new AssessmentBlockchain();