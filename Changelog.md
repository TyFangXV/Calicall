# 0.1.5v


* Dockerized the api 
* Updated the Dependencies 
* Made redis and postgress a part of the api when booting up using docker
 

# 0.1.6v

* Standardized on a way to updating the state when a live change is made
* Extended the duration of the token 
* standard logging system for the app(beta)  

# 0.1.7v

* Custom logger 
* New call prompt
* New Call system


# 0.1.8v

* Connected the Socket with the call prompt 

# 0.1.9v

* finished up with the call prompt and cleaned up the code for websockets


# 0.1.10v

* Temporarily disabled the feature to call
* Can now only accept or decline friend request if the correct param are met
* Added a new Message handler that help the client distinguish between messages from different users and only show the messages of the user the client is chatting with
* Deleted lagacy code
* Shifted functions to its appropriate component
* Added a route identifier to each alert to optimize the notification 
* Cleaned up the code by removing unwanted div and optimized the component hierarchy 
