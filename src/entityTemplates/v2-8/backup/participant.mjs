export const Participant = {
    properties: {
        ParticipantSC: null,
        participantFC: {
            functionalType: null,
            jobTitle: null,
            Role: null,
            // customData: null,
        },
        Context: null,
        Depiction: null,
    },
    inlineFragment: {
        ParticipantSC: {
            Organization: '...on',
            Department: '...on',
            Person: '...on',
            Service: '...on',
        },
    },
};

export const ParticipantSC = {
    properties: {},
};

export const Organization = {
    properties: {
        organizationName: {
            fullName: null,
        },
    },
};

export const Department = {
    properties: {
        structuralType: null,
        departmentName: {
            fullName: null,
        },
        contact: null,
        Location: null,
    },
};

export const Person = {
    properties: {
        structuralType: null,
        personName: {
            fullName: null,
        },
        jobTitle: null,
        gender: null,
        contact: null,
        Location: null,
    },
};

export const Service = {
    properties: {
        structuralType: null,
        serviceName: {
            fullName: null,
        },
        contact: null,
        Location: null,
    },
};

export const Role = {
    properties: {
        roleType: null,
    },
};
