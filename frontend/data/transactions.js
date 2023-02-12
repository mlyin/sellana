export const transactions = [
    {
        id: '1',
        from: {
            name: 'lt',
            avatar: 'https://ca.slack-edge.com/T02AAEL0P-U02TV5RV2TW-g36efad6f5c1-512',
            verified: false,
        },
        to: {
            name: 'rq',
            avatar: 'https://ca.slack-edge.com/T02AAEL0P-U02TV5RV2TW-g36efad6f5c1-512',
            verified: true,
        },
        description: "test send! 👋",
        transactionDate: new Date(),
        status: 'Completed',
        amount: 0.1,
    },
    {
        id: '2',
        from: {
            name: 'lt',
            avatar: 'https://ca.slack-edge.com/T02AAEL0P-U02TV5RV2TW-g36efad6f5c1-512',
            verified: false,
        },
        to: {
            name: 'lt',
            avatar: 'https://ca.slack-edge.com/T8JR01VL4-U02AQ23D15X-63795a2d421c-72',
            verified: false,
        },
        description: 'project',
        transactionDate: new Date(),
        status: 'Incomplete',
        amount: 123.45,
    },
    {
        id: '3',
        from: {
            name: 'lt',
            avatar: 'https://ca.slack-edge.com/T02AAEL0P-U02TV5RV2TW-g36efad6f5c1-512',
            verified: false,
        },
        to: {
            name: 'dr',
            avatar: 'https://ca.slack-edge.com/T8JR01VL4-U01A8CULZ99-22c5b19dd0a7-72',
            verified: false,
        },
        description: 'test2',
        transactionDate: new Date(),
        status: 'Completed',
        amount: 999,
    },
]
