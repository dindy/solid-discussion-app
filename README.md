# 🐙 Solid Discussion App

## ❓ What is it ?

Solid Discussion App (SDA) is a client web application that allows users to have discussions in a [Solid](https://github.com/solid/) environment :
> Solid (derived from "social linked data") is a proposed set of conventions and tools for building decentralized social applications based on Linked Data principles. Solid is modular and extensible and it relies as much as possible on existing W3C standards and protocols.  [source](https://solid.mit.edu/)

To use the application users must have a Solid pod. You can have a free one at [solid.community](https://solid.community/). However some features as read / write in a public discussion doesn't need a Solid pod. 

SDA is written with [React](https://github.com/facebook/react) from [create-react-app](https://github.com/facebook/create-react-app) and follows [redux](https://redux.js.org/) principles.  

The design follows [Material Design](https://material.io/design/) principles.

## 📕 Backlog

### ⭐️ [SDA-1] A user can connect to his pod

#### 📋 Description

A user can authenticate himself with his [WebID](http://www.w3.org/2005/Incubator/webid/spec/identity/) :
> The WebID 1.0 (Web Identity and Discovery) standard is used to provide universal usernames/IDs for Solid apps, and to refer to unique Agents (people, organizations, devices). [source](https://github.com/solid/solid)

The app display the name and the avatar of the connected user if data are fulfilled.

The app recover the previous session.

### 🔧 Implementation 

The app uses [solid-auth-client](https://github.com/solid/solid-auth-client) library to handle authentication with a [Solid server](https://github.com/solid/solid-platform#servers) such as [node-solid-server](https://github.com/solid/node-solid-server/). The library completely abstracts the complexity of authenticating a user and handle the session. 

Once the user is authenticated we load data about the user via his [WebId profile](https://www.w3.org/2005/Incubator/webid/spec/identity/#publishing-the-webid-profile-document) in [turtle](https://www.w3.org/TR/turtle/) format  and parse it with the [rdflib.js library](https://github.com/linkeddata/rdflib.js/) to extract his `foaf:name` and his `foaf:img`. 

### 📅 Status

Done

_______________________

### ⭐️ [SDA-2] A user can create a discussion 

#### 📋 Description

A user can create a new discussion on his pod. 

The user must give a name to the discussion.

The user can choose the storage of the new discussion.

The user choices the path where to store the discussion on the storage. 

### 🔧 Implementation 

The app uses the [SIOC Core Ontology Specification](https://www.w3.org/Submission/sioc-spec/) to modelize business data (discussion, messages, participants, etc.). Other vocabularies will be implemented later. 
The class [`sioc:Thread`](http://rdfs.org/sioc/ns#Thread) is used to represent a discussion. 

New discussion will be created in a dedicated folder on the user's pod. Maybe it could be usefull to save the discussion as a simple file. Maybe a future functionality.

Like for SDA-1 the app uses [rdflib.js library](https://github.com/linkeddata/rdflib.js/) to parse linked data saved on users pod. Especially, the pod explorer allows users to navigate in their [LDPContainers](https://www.w3.org/TR/ldp/#ldpc) by doing a [SPARQL](https://www.w3.org/TR/sparql11-overview/) request locally.

New solid tools are being created ([LDflex](https://github.com/solid/query-ldflex) and [react-components](https://github.com/solid/react-components)). Very promising...

### 📅 Status

Doing

_______________________

### ⭐️ [SDA-3] A user can invite participants

#### 📋 Description

Once a discussion is created the user can invite other people to participate by sending them an invitation with an appropriate link. 
The user can only add members to a discussion he owns.

### Implementation 

### 📅 Status

Done

_______________________

### ⭐️ [SDA-4] A user can load a discussion

#### 📋 Description

A user can load a discussion by hitting a url. The app must display discussion name, messages and participants.

### Implementation 

### 📅 Status

Doing

_______________________