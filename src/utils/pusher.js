import Pusher from "pusher-js";

export const pusher = new Pusher('fb4f78300444a170ad34', {
    cluster: 'mt1', // or your actual cluster
    forceTLS: false,
});