let hostName = window.location.hostname


let URL = 'http://localhost:8042/api/v1/';
let TITLE = "SuperAdmin";
export const FIRMWARE_URL = 'http://cdn.meshguard.co/';


switch (hostName) {

    // MeshGuard Live
    case "sa.lockmesh.com":
    // case "www.meshguard.co":
    case "http://sa.lockmesh.com":
    case "https://sa.lockmesh.com":
        // URL = "https://api.meshguard.co/api/v1/"
        URL = "https://sa.lockmesh.com/api/v1/"
        break;


    // MeshGuard Dev
    case "devsa.lockmesh.com":
    case "http://devsa.lockmesh.com":
    case "https://devsa.lockmesh.com":
        // URL = "https://devapi.meshguard.co/api/v1/"
        URL = "https://devsa.lockmesh.com/api/v1/"
        break;
    // // MeshGuard Live

    // case "meshguard.co":
    // case "www.meshguard.co":
    // case "http://www.meshguard.co":
    // case "https://www.meshguard.co":
    //     // URL = "https://api.meshguard.co/api/v1/"
    //     URL = "https://meshguard.co/api/v1/"
    //     break;

    // MeshGuard Dev
    // case "dev.meshguard.co":
    // case "http://dev.meshguard.co":
    // case "https://dev.meshguard.co":
    //     // URL = "https://devapi.meshguard.co/api/v1/"
    //     URL = "https://dev.meshguard.co/api/v1/"
    //     break;
    default:
        break;
}


let USER_URI = URL + 'users/';

export const BASE_URL = URL;

export const APP_TITLE = TITLE;

export const USER_URL = USER_URI