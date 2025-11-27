import api from './client';

export const cashBoxApi = {
    open: (data: { openingAmount: number; boxNumber: string }) =>
        api.post('/cash-box/open', data),

    close: (data: { cashBoxId: string; actualAmount: number }) =>
        api.post('/cash-box/close', data),

    getActive: () =>
        api.get('/cash-box/active').then(res => res.data),

    getHistory: () =>
        api.get('/cash-box/history').then(res => res.data),

    addTransaction: (data: { cashBoxId: string; type: string; amount: number; description: string }) =>
        api.post('/cash-box/transaction', data),
};
