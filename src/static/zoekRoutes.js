const stop2Hilversum = {
    name: "Hilversum",
    code: "HV",
    plannedArrivalDateTime: new Date(),
    plannedDepartureDateTime: new Date(),
    plannedArrivalTrack: 2
}

const stop4Hilversum = {
    name: "Hilversum",
    code: "HV",
    plannedArrivalDateTime: new Date(),
    plannedDepartureDateTime: new Date(),
    plannedArrivalTrack: 1
}

const stop1Amsterdam = {
    name: "Amsterdam Centraal",
    code: "ASD",
    plannedArrivalDateTime: new Date(),
    plannedDepartureDateTime: new Date(),
    plannedArrivalTrack: 11
}

const stop3Bussum = {
    name: "Bussum",
    code: "BSM",
    plannedDepartureDateTime: new Date(),
    plannedArrivalDateTime: new Date(),
    plannedArrivalTrack: 1
}

const stop5Utrecht = {
    name: "Utrecht Centraal",
    code: "UT",
    plannedDepartureDateTime: undefined,
    plannedArrivalDateTime: new Date(),
    plannedArrivalTrack: 3
}

const trip1 = {
    stops: [stop1Amsterdam, stop2Hilversum, stop5Utrecht],
    tripIdx: 0
}

const trip2 = {
    stops: [stop3Bussum, stop2Hilversum, stop5Utrecht],
    tripIdx: 1
}

const user1 = {
    uid: 0,
    selectedTrip: trip1,
    plannedFirstDepartureDateTime: trip1.stops[0].plannedDepartureDateTime
}

const user2 = {
    uid: 1,
    selectedTrip: trip2,
    plannedFirstDepartureDateTime: trip2.stops[0].plannedDepartureDateTime
}

const users = [user1, user2]
const routes = new Map([])  // route, [user1, user2]


function addUserToRoutes(user){
    user.selectedTrip.stops.forEach((stop, stopIndex) => {

        let routeUsers = routes.get(stop.code);

        if(routeUsers === undefined){
            routeUsers = [];
        }

        routeUsers.push(user);

        routes.set(stop.code, routeUsers)

        console.log("User " + user.uid + " added to station " + stop.code);
    });
}

addUserToRoutes(user1);
addUserToRoutes(user2);

function getUserStations(user){

    const stations = [];

    routes.forEach((station, users) => {

        if(users.includes(user)){
            stations.push(station);
        }

    });

    return stations;
}

function searchRoutes(user){

    // Irritate over the routes of the user

    // Get stations of given user, if user is not registered, give error
    const userStations = getUserStations(user);
    const possibleMeetings = [];

    routes.forEach((station, users) => {

        // Check if the given userStations contains another station
        if(userStations.includes(station)){

            // Look if there are more people at this station
            if(users.length > 1){
                // Meetup is possible, add to possibleMeetups

                const meeting = {
                    meetingStation: station,
                    meetingUsers: users,
                    meetingTime: new Date()
                }

                possibleMeetings.push(meeting);
            }
        }

        // Select a random possible meeting (or give the user option in the future)
        const random

    });



    const sharedTrip = {
        meetingStationName: test,
        meetingStationCode: code,
        meetingStationPerron: perron,
        meetingStationTimeFrame: timeFrame
    }


}