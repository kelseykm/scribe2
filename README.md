# **scribe2**
*The only way to take notes in a modern world*

* Scribe is a web application that allows you to take both voice and text notes.
* Users have accounts, which they sign up for, or log into.
* The application is structured thus:
  ```
  Subjects
  |_
    Sections
    |_
      Topics
      |_
        Notes (text/voice)
  ```

### **Installation**
* Clone the repository with git so that updating the app in future will be easier for you. Run ```git clone https://github.com/kelseykm/scribe2.git```.
* Ensure you have the latest _current_ Node installed (not the LTS version).
* ```cd``` into the directory containing the ```package.json``` file and run ```npm ci``` to install all the dependencies.
* Make a directory called ```certs```, ```cd``` into it and run ```openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365```
* Put the passphrase of the private key generated in the ```.env``` file. The passphrase is the one that openssl asked for when you ran the openssl command.
* Provide a *session secret* in the ```.env``` file. This can be any string of your choosing.
* Run ```npm run build``` to build the application.
* FOR LINUX USERS ==> The application uses ports 80 and 443, so run the following command as root or with sudo to allow node access to priviledged ports:
  ```
  setcap 'cap_net_bind_service=+ep' [PATH TO NODE]
  ```
  Replace the ```[PATH TO NODE]``` with the path to your local node. If you don't know it, the command ```which node``` or ```type node``` will help.
  Make sure the path points to the actual node file and not a symlink.
* If you have any services listening on those ports (80 & 443), close them before starting scribe.

### **Start up**
* To start the app, ```cd``` into the directory containing the ```package.json``` file and run ```npm run start```
* In your browser, navigate to ```https://localhost``` or ```https://127.0.0.1```
* If your browser shows you a warning that your connection is not secure, it's okay. It's because you're using a self signed certificate. Click on ```Advanced``` and then click on ```Proceed```
* NB: I highly recommend you use the **latest version** of Google Chrome browser for the best experience. Avoid Firefox. If you come across any thing that doesn't seem to work while you're using firefox or another browser, please switch to Google Chrome and see if the observed behaviour repeats before reporting it as a bug.

### **Maintenance and updates**
* Run ```git pull``` inside the directory with the ```package.json``` periodically to ensure you install all updates, bugfixes and new features.
* Everytime you execute the command mentioned in the point above, please run ```npm ci```, to install/remove any dependencies that may have been added/removed in the aforementioned updates.
* Also make sure to run ```npm run build``` after the running the command above, for the same reason.
* As from version 2.1.0, if you were using the older scribe versions, please run ```node cryptoMigrator.js``` for each user to migrate your encrypted notes to the new encryption cipher

###### *Demo video*
[![Alternate Text](./demo_video/thumbnail.png)](https://youtu.be/042gBdWzMg0 "scribe2 demo")
