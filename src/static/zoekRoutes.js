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

const stop6Maastricht = {
    name: "Maastricht",
    code: "MST",
    plannedDepartureDateTime: undefined,
    plannedArrivalDateTime: new Date(),
    plannedArrivalTrack: 3
}

const stop6Amersfoort = {
    name: "Amersfoort Centraal",
    code: "AMF",
    plannedDepartureDateTime: new Date(),
    plannedArrivalDateTime: new Date(),
    plannedArrivalTrack: 5
}

const trip1 = {
    stops: [stop1Amsterdam, stop2Hilversum, stop5Utrecht],
    tripIdx: 0
}

const trip2 = {
    stops: [stop6Amersfoort, stop3Bussum, stop4Hilversum, stop5Utrecht],
    tripIdx: 1
}

const trip3 = {
    stops: [stop6Maastricht, stop3Bussum, stop4Hilversum, stop5Utrecht],
    tripIdx: 2
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

const user3 = {
    uid: 2,
    selectedTrip: trip3,
    plannedFirstDepartureDateTime: trip3.stops[0].plannedDepartureDateTime
}

const users = [user1, user2, user3]
const routes = new Map([])  // route, [user1, user2]


function addUserToRoutes(user) {
    user.selectedTrip.stops.forEach((stop, stopIndex) => {

        if (stop.code === "UT") {
            return;  // skip Utrecht
        }

        let routeUsers = routes.get(stop.code);

        if (routeUsers === undefined) {
            // Station doesn't exist yet, so create a new users entry
            routeUsers = [];
        }

        // Add user to the station
        routeUsers.push(user);

        routes.set(stop.code, routeUsers);

        console.log("User " + user.uid + " added to station " + stop.code);
    });
}

addUserToRoutes(user1);
addUserToRoutes(user2);
addUserToRoutes(user3);

function getUserStations(user){

    const stations = [];

    routes.forEach((users, stop) => {

        if(users.includes(user)){
            stations.push(stop);
        }

    });

    return stations;
}

searchRoutes(user1);
searchRoutes(user2);

function searchRoutes(user) {
    // Get stations of the given user, if the user is not registered, give an error
    const userStations = getUserStations(user);
    const possibleMeetings = [];

    routes.forEach((users, stop) => {
        // Check if the given userStations contains another station
        if (userStations.includes(stop)) {
            // Look if there are more people at this station
            if (users.length > 1) {
                // Meetup is possible, add to possibleMeetups

                // TODO: Add last check if times overlap, if not, do not add meeting to possibleMeetings

                const meeting = {
                    meetingStation: stop,
                    meetingUsers: users,
                    meetingTime: new Date()
                };
                console.log("New possible meeting detected: " + meeting.meetingStation + " with user(s) uid " + users.map(u => u.uid));
                possibleMeetings.push(meeting);
            }
        }
    });

    // Select a random possible meeting (or give the user an option in the future)
    if (possibleMeetings.length > 0) {
        const randomMeeting = possibleMeetings[Math.floor(Math.random() * possibleMeetings.length)];
        console.log("\n\nRandom selected meeting: " + randomMeeting.meetingStation + " with user(s) uid " + randomMeeting.meetingUsers.map(u => u.uid));
    } else {
        console.log("\n\nNo possible meetings found.");
    }


    /*
    const sharedTrip = {
        meetingStationName: test,
        meetingStationCode: code,
        meetingStationPerron: perron,
        meetingStationTimeFrame: timeFrame
    }
     */


}