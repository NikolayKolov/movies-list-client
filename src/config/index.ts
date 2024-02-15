const configs = {
    // the time interval in milliseconds to refresh the main movies list
    // the date in the app is updated at bulk every day, so a 12 hour max cache time
    mainRefreshTime: 1000 * 60 * 60 * 12,
    // check for updates interval - ping the server if an update has happened -
    // get the last time updated and compare with local last time updated
    // once a minute
    pingUpdates: 1000 * 60
};

export default configs;