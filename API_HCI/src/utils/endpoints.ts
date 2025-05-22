type Endpoint = {
    method?: string;
    path: string;
    isAnonymous?: boolean;
};

const API_PREFIX = '/api';

const ENDPOINTS_ROOT = {
    DOCS: '/docs',
    API_DOCS: '/api-docs',
    FAVICON: '/favicon.ico',
    USER: `${API_PREFIX}/user`,
    ACCOUNT: `${API_PREFIX}/account`,
    CARD: `${API_PREFIX}/card`,
    INVESTMENT: `${API_PREFIX}/investment`,
    PAYMENT: `${API_PREFIX}/payment`,
};

const DOCS_ENDPOINTS: Endpoint[] = [
    {
        method: "GET",
        path: ENDPOINTS_ROOT.DOCS,
        isAnonymous: true,
    },
    {
        method: "GET",
        path: ENDPOINTS_ROOT.API_DOCS,
        isAnonymous: true,
    },
    {
        method: "GET",
        path: ENDPOINTS_ROOT.FAVICON,
        isAnonymous: true,
    }
];

const USER_ENDPOINTS: Endpoint[] = [
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}`,
        isAnonymous: true,
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}/login`,
        isAnonymous: true,
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}/resend-verification`,
        isAnonymous: true,
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}/verify`,
        isAnonymous: true,
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}/reset-password`,
        isAnonymous: true,
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.USER}/change-password`,
        isAnonymous: true,
    }
];

const ACCOUNT_ENDPOINTS: Endpoint[] = [
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.ACCOUNT}`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.ACCOUNT}/recharge`
    },
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.ACCOUNT}/verify-cvu`
    },
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.ACCOUNT}/verify-alias`
    },
    {
        method: "PUT",
        path: `${ENDPOINTS_ROOT.ACCOUNT}/update-alias`
    },
];

const CARD_ENDPOINTS: Endpoint[] = [
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.CARD}`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.CARD}`
    },
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.CARD}/:id`
    },
    {
        method: "DELETE",
        path: `${ENDPOINTS_ROOT.CARD}/:id`
    }
];

const INVESTMENT_ENDPOINTS: Endpoint[] = [
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.INVESTMENT}/daily-rate`
    },
    {
        method: "GET",
        path: `${ENDPOINTS_ROOT.INVESTMENT}/daily-returns`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.INVESTMENT}/invest`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.INVESTMENT}/divest`
    },
]

const PAYMENT_ENDPOINTS: Endpoint[] = [
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.PAYMENT}/pull`
    },
    {
        method: "PUT",
        path: `${ENDPOINTS_ROOT.PAYMENT}/push`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.PAYMENT}/transfer-email`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.PAYMENT}/transfer-cvu`
    },
    {
        method: "POST",
        path: `${ENDPOINTS_ROOT.PAYMENT}/transfer-alias`
    }
]

export const allRoutes: Endpoint[] = [
    ...Object.values(DOCS_ENDPOINTS),
    ...Object.values(USER_ENDPOINTS),
    ...Object.values(CARD_ENDPOINTS),
    ...Object.values(ACCOUNT_ENDPOINTS),
    ...Object.values(INVESTMENT_ENDPOINTS),
    ...Object.values(PAYMENT_ENDPOINTS),
];

export const anonymousRoutes: Endpoint[] = [
    ...Object.values(DOCS_ENDPOINTS),
    ...Object.values(USER_ENDPOINTS),
];

export default ENDPOINTS_ROOT;