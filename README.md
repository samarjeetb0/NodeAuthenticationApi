# NodeAuthenticationApi

# This is production ready authentiaction node api project

# Mongodb : Database and Redis : MemoryDatabase to store key value pair of user and user-token 

# Create a .env file and then enter the following records

# PORT = 3000

# DB_CON = mongodb+srv://username:password@cluster0.ewcyi.mongodb.net/databasename 
  
# ACCESS_TOKEN_SECRET =0a39b613aa38188eb203b1976af5b1c1becf7504206bb4b8c6238d809b2305d8

# REFRESH_TOKEN_SECRET =993f84cdb66ae9502ff7ebed9b83602dfd570f7c8565592dea224783934c60ad

# use generate_keys.js file to generate ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET

# This is being used to generate secret keys for acces token and refresh token In future if you feel in any miss use of your application you can generate new keys and set up in the env file
