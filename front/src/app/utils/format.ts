export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  export function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  export function calculateTimeLeft(endDate: Date): string {
    const difference = +endDate - +new Date();
    
    if (difference <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    if (days > 1) {
      return `${days} days left`;
    } else if (days === 1) {
      return '1 day left';
    }
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${hours} hours left`;
  }
  export function calculateDaysLeft(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  export function calculateProgress(raised: number, goal: number): number {
    if (goal === 0) return 0;
    return Math.min(Math.round((raised / goal) * 100), 100);
  }
  