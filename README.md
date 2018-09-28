# 🐙 Solid Discussion App

## ❓ What is it ?

Solid Discussion App (SDA) is a client web application that allows users to have discussions in a [Solid](https://github.com/solid/) environment :
> Solid (derived from "social linked data") is a proposed set of conventions and tools for building decentralized social applications based on Linked Data principles. Solid is modular and extensible and it relies as much as possible on existing W3C standards and protocols.  [source](https://solid.mit.edu/)

To use the application users must have a Solid pod. You can have a free one at [solid.community](https://solid.community/). However some features as read / write in a public conversation doesn't need a Solid pod. 

SDA is written with [React](https://github.com/facebook/react) from [create-react-app](https://github.com/facebook/create-react-app) and follows [redux](https://redux.js.org/) principles.  

The design follows [Material Design](https://material.io/design/) principles.

## 📕 Backlog

### ⭐️ [SDA-1] A user can connect to his pod

#### 📋 Description

A user can authenticate himself with his [WebID](http://www.w3.org/2005/Incubator/webid/spec/identity/) :
> The WebID 1.0 (Web Identity and Discovery) standard is used to provide universal usernames/IDs for Solid apps, and to refer to unique Agents (people, organizations, devices). [source](https://github.com/solid/solid)

The app display the name of the connected user.

### 🔧 Implementation 

The app uses [solid-auth-client](https://github.com/solid/solid-auth-client) library to handle authentication with a [Solid server](https://github.com/solid/solid-platform#servers) such as [node-solid-server](https://github.com/solid/node-solid-server/). The library completely abstracts the complexity of connecting a user. 

### ⭐️ [SDA-2] A user can create a discussion 

#### 📋 Description

A user can create a new discussion on his pod in a way that is compliant with Solid and Linked Data good practises. 

### 🔧 Implementation 

#### Vocabulary

The app uses the [SIOC Core Ontology Specification](https://www.w3.org/Submission/sioc-spec/) to modelize  data. E.g : The class [`sioc:Thread`](http://rdfs.org/sioc/ns#Thread) represents a discussion. 

#### Follow your nose

#### Resource authorizations

### ⭐️ [SDA-3] A user can invite people

#### 📋 Description

Once a discussion is created the user can invite other people to participate by sending them an invitation with an appropriate link. 
The user can only add members to a discussion he owns.

### Implementation 
