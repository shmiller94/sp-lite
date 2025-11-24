import { Protocol } from '../api';

// Determines if an activity belongs to the current protocol
export const isActivityInProtocol = (activity: any, protocol: Protocol) => {
  if (activity.type === 'product' || activity.type === 'prescription') {
    const protocolCreatedDate = new Date(protocol.created);
    const purchaseDate = activity.purchaseDate
      ? new Date(activity.purchaseDate)
      : null;

    return !purchaseDate || purchaseDate > protocolCreatedDate;
  }

  return true;
};
