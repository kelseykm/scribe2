# **scribe2**
*The only way to take notes in a modern world*

* Scribe is a web application that allows you to take both voice and text notes.
* Users have accounts, which they sign up for, or log into.
* The application is structured thus:
  ```
  Subject
  |_
    Sections
    |_
      Topics
      |_
        Notes (text/voice)
  ```

### **Installation**
* Ensure you have Node installed.
* ```cd``` into the directory containing the ```package.json``` file and run ```npm install``` to install all the dependencies.
* Make a directory called ```certs```, ```cd``` into it and run ```openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365```
* Put the passphrase of the private key generated in the ```.env``` file.
* Provide a *session secret* in the ```.env``` file.
* Run ```npm run build``` to build the application.

### **Start up**
* To start the app, ```cd``` into the directory with the app and run ```npm run start```
* In your browser, navigate to ```https://localhost```

### ***Additional comments***
* If your operating system requires you to run as root to be able to use priviledged ports (1-1024), and you do not wish to run node as root, you may change the default ports in the ```.env``` file and redirect all requests to ports 443 and 80 to the new ports (using iptables, or your preferred firewall).

###### *Demo video*
[![Alternate Text](./demo_video/thumbnail.png)](https://youtu.be/042gBdWzMg0 "scribe2 demo")
