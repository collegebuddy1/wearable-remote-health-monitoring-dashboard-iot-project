# MHMP Front-End Dashboard User's Guide
This user guide contains a brief tutorial to get you started using the provided MHMP frontend dashboard. 

---

## Logging In and Account Creation

1. When first opening the application, you will be greeted with the login screen powered by Amazon Cognito. Please click **Create account** if you have not yet created one.

<img src="./images/user_guide/UserGuide-1.0.0.png"  width="400"/>

2. Please fill out the *Username* field with your email address. This is the username you will need to login. Fill out the rest of the form then click **CREATE ACCOUNT**.

<img src="./images/user_guide/UserGuide-1.0.1.png"  width="400"/>

3. You should then receive a verification code delivered to the email address you selected. Please note that it could take up to a few minutes to recieve this verification code. Once received, enter the verification code and click **CONFIRM**.

<img src="./images/user_guide/UserGuide-1.0.2.png"  width="400"/>

### Logging Out
To log out, click on the top right menu button then click **Logout**. 

<img src="./images/user_guide/UserGuide-1.0.3.png"  width="400"/>

---

## UI
After logging in, the system will fetch required data from the backend after which you will be greeted with the dashboard's homepage. This page contains two tables. The top one containing alerts with details and a location finder. The bottom table contains a list of all users with real-time status updates and heart rates.  

<img src="./images/user_guide/UserGuide-2.0.0.png"  width="500"/>

### Alerts
Alerts can be dismissed by clicking on the actions tab and clicking **Marked As Resolved**. This not only deletes the alert, but it resets the user's status to normal. This is important because once a heart rate or location alert is received, no new alerts will be generated until the status of the user is cleared. 

<img src="./images/user_guide/UserGuide-2.0.3.png"  width="500"/>

A map view of the user's location at the time the alert was generated can be viewed by clicking **View** in an alert entry. 

<img src="./images/user_guide/UserGuide-2.0.2.png"  width="500"/>

Additionally, an alert notification will appear on the left sidebar. This sidebar is persistant on any page of the application so that the admin user can be notified of new alerts no matter where they are in the application.

<img src="./images/user_guide/UserGuide-2.0.4.png"  width="300"/>


#### Real-time Alert Subscription Status
The *Realtime Status* at the top of the dashboard indicates that the real-time alert system is functioning correctly if it is green and displays *Connected*. Disruptions such as an internet connection loss will result in the real-time alert system (subscription) being cancelled. This will be indicated by the *Realtime Status* displaying a red dot and a *Disconnected* message. Please check your internet connection and refresh the application to troubleshoot and re-establish the real-time connection.

<img src="./images/user_guide/UserGuide-2.0.1.png"  width="500"/>

---

## User Management
Clicking on the **Manage Users** button from the left-hand navigation bar will take you to the user management page.

### Registering a User

<img src="./images/user_guide/UserGuide-3.0.0.png"  width="500"/>

From here, you'll find a link to register a new user in the system. For user registration, first and last names are required fields, all others are optional. 

### User Profile
Once you've registered the new user, you can view their profile by clicking on the appropriate actions tab and selecting *View Profile*. 

<img src="./images/user_guide/UserGuide-3.0.1.png"  width="500"/>

From the user's profile page, you can edit their personal information by clicking **Edit Profile**. After making changes, ensure that you click the **Save Changes** button to save your update. Youy can also find the user's real-time location on a map by clicking **Locate User** from the right-hand panel. 

### Data Visualization
You can view a graph of the patient's historical heart rate data over the last one hour period by clicking **View Data** from the user's profile page. This functionality can be extended to other data types (eg. O2 levels) if desired but currently only heart rate visualization has been implemented. 

<img src="./images/user_guide/UserGuide-3.0.2.png"  width="500"/>


### Deleting a User
You can also delete a user by clicking **Delete User** from either the user's profile page or from the *Actions* tab in the User Management page. Please ensure that you have unpaired any device associated with the user before attempting a deletion. You will be blocked from deleting a user if they have a device paired to them.

---

## Device Management
Clicking on the **Manage Devices** button from the left-hand navigation bar will take you to the device management page.

<img src="./images/user_guide/UserGuide-4.0.0.png"  width="500"/>

### Registering a Device
Devices can be registered manually or automatically. By clicking **Register a Device**, the unique Device ID that corresponds to the wearable device should be inputted. This information can be found after installing the companion application onto the wearable device. Alternatively, once the moblile device is set-up and starts sending data to the AWS IoT Core, it will be registered automatically if it hasn't been registered already.

Once a device is registered, the device status will be set to *Inactive* if registered manually, or *Ready* if registered automatically. More information on the function of the device status can be found in the *Device Status* section below.

### Deleting a Device
Devices can only be deleted after they have first been unpaired from an associated user. Once a device is unpaired, it can be deleted by simply clicking **Delete Device** from the *Actions* tab and following the prompt.

### Device Status
The device status is synonymous with the "status" of users displayed on the dashboard's homepage. This provides important information about the state of the device or its user.
The following is a breakdown of the possible device states:
  - **Ready**: The device has been registered and is actively sending data.
  - **Inactive**: The device has not sent data in the past hour. This could possbily indicate a malfunction or depleted battery if the device is currently set-up correctly and         paired with a user.
  - **Normal**: The device is actively sending data.
  - **Location_Anomaly**: A location anomaly has been detected for the user associated with the device. No new location alerts will be dispatched until the device status has been cleared manually (marking an lert as resolved from the dashboard). 
  - **HeartRate_Anomaly**: A heart rate anomaly has been detected for the user associated with the device. No new heart rate or location alerts will be dispatched until the device status has been cleared. Please note that heart rate alerts have been given priority over location based alerts (ie. once the status has been set to HeartRate_Anomaly, the status is not updated to reflect a following Location_Anomaly).

### Pairing a Device to a User
To pair a device to a user, click on the appropriate *Actions* tab from the table and click **Pair Device**. This will prompt a pop-up from which you can select a user to pair the device with. Please note that only one device can be paired to a user at a time.

<img src="./images/user_guide/UserGuide-4.0.1.png"  width="500"/>

### Unpair a Device from a User
To unpair a device, simply click **Unpair Device** from the *Actions* tab and follow the prompt.

---

## Location Management
Clicking on the **Manage Locations** button from the left-hand navigation bar will take you to the location management page. A *Location* is essentially a geofence that defines the geographic boundaries of a particular location. A location can be assigned to a user, and an alert will be generated if the user breaches the location perimeter.

<img src="./images/user_guide/UserGuide-5.0.0.png"  width="500"/>

### Creating a New Location
Clicking on the **Create a Location** button will take you to new page where you can draw the boundaries of your new location.

<img src="./images/user_guide/UserGuide-5.0.1.png"  width="500"/>

To find a particular place on the map, enter the address of the location you would like to add ("Step 1" input field). This will prompt a list of predicted valid addresses from which you can choose from (results are biased towards your current location). You can also find the location you are looking for by simply panning the map to the desired area.  

<img src="./images/user_guide/UserGuide-5.0.2.png"  width="500"/>

The next step is to draw the boundaries of your desired geofence on the map. To initiate this, simply click the map at a point of your desired geofence then add more dots to form the boundaries. You must draw a valid polygon in order to create a location. The *Boundaries Drawn?* indicator will turn green once you have drawn a valid polygon. You can restart the drawing anytime by simply clicking **Redraw**.

<img src="./images/user_guide/UserGuide-5.0.3.png"  width="500"/>

### Deleting a Location
To delete a location, simply click **Delete Location** from the *Actions* tab in the *Location Management* page. Before deleting a location, we reccommend that you remove the location from any users that have been assigned to it.

### Adding a Location/Geofence to a User
To assign a location/geofence to a user, the user must first have a device paired with them. From the *User Management* page, select the *Actions* tab for the appropriate user, then click **Assign a Location**. A pop-up will be shown with a list of locations you've created.

### Removing a Location from a User
To remove a location from a user, simply click **Remove Location** from the *Actions* tab in the *User Management* page. 



