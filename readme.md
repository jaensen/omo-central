This repository contains packets that can be used to verify that a user is either
in control of an email address or a private key.  
Further it provides a centralized encrypted data store that can be unlocked with this proof.  

## Services
### auth
The ***auth*** packet contains a nodejs server that is built around Apollo server and 
provides a GraphQL endpoint with the following functions:
* loginWithEmail
* loginWithPublicKey
* verify

The two login methods send a challenge to the user. The solved challenge can then be verified.  
If the user solved the challenge correctly, the ***auth*** service returns a JWT that can be used
to prove the control over the email address or private key to other services that trust 
the ***auth*** service's authority.

### identity
The ***identity*** service stores profiles for authenticated users. It accepts the JWT's from 
the ***auth*** service and allows the user to exchange them for a session at the ***identity*** service.  
Once the user has a session, he/she can read or write his/her personal profile.   
The profile itself is split into a public and a private part. The public part is accessible by everyone who
knows the "identityId" of the person. 
The private part is also accessible by everyone who knows the "identityId" but is AES encrypted with a user-specific key.
