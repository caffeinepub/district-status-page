import Iter "mo:core/Iter";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type Severity = {
    #critical;
    #major;
    #minor;
    #informational;
  };

  type Status = {
    #investigating;
    #identified;
    #monitoring;
    #resolved;
  };

  module Status {
    public func fromText(statusText : Text) : Status {
      switch (statusText) {
        case ("investigating") { #investigating };
        case ("identified") { #identified };
        case ("monitoring") { #monitoring };
        case ("resolved") { #resolved };
        case (_) { Runtime.trap("Invalid status type") };
      };
    };
  };

  type IncidentUpdate = {
    message : Text;
    timestamp : Time.Time;
  };

  type Incident = {
    id : Text;
    title : Text;
    description : Text;
    affectedService : Text;
    severity : Severity;
    status : Status;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    updates : [IncidentUpdate];
  };

  type IncidentDTO = {
    id : Text;
    title : Text;
    description : Text;
    affectedService : Text;
    severity : Severity;
    status : Status;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    updates : [IncidentUpdate];
  };

  type IncidentUpdateDTO = {
    message : Text;
    timestamp : Time.Time;
  };

  type DeleteIncidentResult = {
    #success;
    #notFound;
    #notResolved;
  };

  let incidentsMap = Map.empty<Text, Incident>();

  public shared ({ caller }) func createIncident(
    id : Text,
    title : Text,
    description : Text,
    affectedService : Text,
    severity : Severity,
  ) : async IncidentDTO {
    let now = Time.now();
    let incident : Incident = {
      id;
      title;
      description;
      affectedService;
      severity;
      status = #investigating;
      createdAt = now;
      updatedAt = now;
      updates = [];
    };

    incidentsMap.add(id, incident);
    {
      id;
      title;
      description;
      affectedService;
      severity;
      status = #investigating;
      createdAt = now;
      updatedAt = now;
      updates = [];
    };
  };

  public shared ({ caller }) func addUpdate(
    incidentId : Text,
    title : Text,
    description : Text,
    affectedService : Text,
    severity : Severity,
    message : Text,
  ) : async IncidentDTO {
    let now = Time.now();

    switch (incidentsMap.get(incidentId)) {
      case (null) {
        await createIncident(incidentId, title, description, affectedService, severity);
      };
      case (?incident) {
        let update : IncidentUpdate = {
          message;
          timestamp = now;
        };
        let updatesList = List.fromArray<IncidentUpdate>(incident.updates);
        updatesList.add(update);
        let updatedIncident = {
          id = incident.id;
          title = incident.title;
          description = incident.description;
          affectedService = incident.affectedService;
          severity = incident.severity;
          status = incident.status;
          createdAt = incident.createdAt;
          updatedAt = now;
          updates = updatesList.toArray();
        };

        incidentsMap.add(incidentId, updatedIncident);
        {
          id = incident.id;
          title = incident.title;
          description = incident.description;
          affectedService = incident.affectedService;
          severity = incident.severity;
          status = incident.status;
          createdAt = incident.createdAt;
          updatedAt = now;
          updates = updatesList.toArray();
        };
      };
    };
  };

  public shared ({ caller }) func changeStatus(
    incidentId : Text,
    title : Text,
    description : Text,
    affectedService : Text,
    severity : Severity,
    newStatus : Text,
  ) : async IncidentDTO {
    let now = Time.now();

    switch (incidentsMap.get(incidentId)) {
      case (null) {
        await createIncident(incidentId, title, description, affectedService, severity);
      };
      case (?incident) {
        let updatedIncident = {
          id = incident.id;
          title = incident.title;
          description = incident.description;
          affectedService = incident.affectedService;
          severity = incident.severity;
          status = Status.fromText(newStatus);
          createdAt = incident.createdAt;
          updatedAt = now;
          updates = incident.updates;
        };

        incidentsMap.add(incidentId, updatedIncident);
        {
          id = incident.id;
          title = incident.title;
          description = incident.description;
          affectedService = incident.affectedService;
          severity = incident.severity;
          status = Status.fromText(newStatus);
          createdAt = incident.createdAt;
          updatedAt = now;
          updates = incident.updates;
        };
      };
    };
  };

  public shared ({ caller }) func deleteIncident(id : Text) : async DeleteIncidentResult {
    switch (incidentsMap.get(id)) {
      case (null) {
        #notFound;
      };
      case (?incident) {
        switch (incident.status) {
          case (#resolved) {
            incidentsMap.remove(id);
            #success;
          };
          case (_) {
            #notResolved;
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllIncidents() : async [IncidentDTO] {
    let iter = incidentsMap.values();
    iter.toArray();
  };

  public query ({ caller }) func getIncident(incidentId : Text) : async ?IncidentDTO {
    switch (incidentsMap.get(incidentId)) {
      case (null) { null };
      case (?incident) { ?incident };
    };
  };

  public query ({ caller }) func isIdAlreadyUsed(id : Text) : async Bool {
    incidentsMap.containsKey(id);
  };
};
