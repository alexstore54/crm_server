export const SEEDS = {
    ROLE: {
        UNSIGNED: {
            PUBLIC_ID: "c6cb2cfb-3e0c-493e-bbf4-ca2ba3090a65",
            NAME: "Unsigned",
            IS_VISIBLE: true,
            IS_MUTABLE: false,
        },
        MODERATOR: {
            PUBLIC_ID: "de798bd2-80d4-4c19-9b33-9e402df93919",
            NAME: "Moderator",
            IS_VISIBLE: false,
            IS_MUTABLE: false,
        },
        LOW_ACCESS: {
            NAME: "Minimum access",
        }
    },
    DESK: {
        UNSIGNED: {
            PUBLIC_ID: "17af3ab6-8399-42d4-9b6c-0ef6c432e61c",
            NAME: "Unsigned Desk",
            AVATART_URL: "https://images.unsplash.com/photo-1594450281353-5a7a067358cc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        CA: {
            PUBLIC_ID: "b82ad7dc-5944-4597-82d4-06e63e5595d1",
            NAME: "Canada",
            AVATART_URL: "https://images.unsplash.com/photo-1607578774871-249a5b07c380?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        IT: {
            PUBLIC_ID: "f3a47a37-a374-49c6-a8bf-27ef1db40486",
            NAME: "Italy",
            AVATART_URL: "https://plus.unsplash.com/premium_photo-1674591172725-26cce04011ff?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }  
    },
    AGENT: {
       UNSIGNED: {
            EMAIL: "no_access@mail.com", //pass --> no_access
            PASSWORD: "$2b$12$NUcEH7183p7eCJWOAkTIbOSHElNnYKgJ/vz2KL329GWf68XLCckPm" 
       },
       LOW_ACCESS: {
            EMAIL: "low_access@mail.com", //pass--> low_access
            PASSWORD: "$2b$12$cz2KEVE2t4DyEGQy071BkecHqhuEGYz.Y1oM9bxkabY0xeyMTpaZS" 
       }
    }
    // TEAM: {
    //     AVENGERS: {
    //         NAME:

    //     },

    // }

    // AGENT: {
    //     UNSIGNED: {
            
    //     },
    //     MODERATOR: {

    //     }

    // }
}