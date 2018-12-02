DROP TRIGGER IF EXISTS ofeDefault;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS Reservations;
DROP TABLE IF EXISTS OnFlightExtra;
DROP TABLE IF EXISTS Extra;
DROP TABLE IF EXISTS FlightReview;
DROP TABLE IF EXISTS OnFlight;
DROP TABLE IF EXISTS Flight;
DROP TABLE IF EXISTS PaymentOption;
DROP TABLE IF EXISTS Alias;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Airplane;
DRop TABLE IF EXISTS AirplaneModel;
DROP TABLE IF EXISTS Airport;

CREATE TABLE Airport (
  aid           CHAR(4),
  country       CHAR(3),
  city          VARCHAR(50),
  state         VARCHAR(50),
  street        VARCHAR(50),
  name          VARCHAR(100),
  service       CHAR(4),
  securityLevel integer,
  PRIMARY KEY (aid)
);

CREATE TABLE AirplaneModel (
  model         CHAR(5),
  numSeats      integer,
  numFirstClass integer,
  numStanding   integer,
  manufacturer  VARCHAR(50),
  colFirstClass integer,
  colEcon       integer,
  description   TEXT,
  PRIMARY KEY (model)
);

CREATE TABLE Airplane (
  model   CHAR(5) NOT NULL,
  manDate DATE NOT NULL,
  pid     CHAR(5),
  PRIMARY KEY (pid),
  FOREIGN KEY (model) REFERENCES AirplaneModel (model)
    on update CASCADE
    on delete NO ACTION
);

CREATE TABLE Customer (
  cno      CHAR(5),
  username VARCHAR(50),
  password VARCHAR(50),
  email VARCHAR(50),
  PRIMARY KEY (cno),
  UNIQUE(username)
);

CREATE TABLE Alias (
  aliasId          integer,
  cno         CHAR(5),
  aliasFirst  VARCHAR(50),
  aliasMid    VARCHAR(50),
  aliasLast   VARCHAR(50),
  country     CHAR(3),
  passportNum CHAR(10),
  UNIQUE (passportNum, country),
  PRIMARY KEY (aliasId),
  FOREIGN KEY (cno) REFERENCES Customer (cno)
    on update cascade
    on delete cascade
);

CREATE TABLE PaymentOption (
  cno            CHAR(5),
  cardNum        CHAR(16),
  cardEXP        CHAR(4),
  cardCCV        CHAR(3),
  billingAddress VARCHAR(50),
  billingCity    VARCHAR(50),
  billingState   CHAR(2),
  billingCountry CHAR(3),
  billingZIP     CHAR(6),
  PRIMARY KEY (cno, cardNum),
  FOREIGN KEY (cno) REFERENCES Customer (cno)
    on update cascade
    on delete cascade
);

CREATE TABLE Flight (
  fid              CHAR(6),
  dept            CHAR(4) NOT NULL,
  arr             CHAR(4) NOT NULL,
  deptTime        DATETIME NOT NULL,
  arrTime         DATETIME NOT NULL,
  actDeptTime     DATETIME,
  actArrTime      DATETIME,
  price           DECIMAL(10, 2) NOT NULL,
  priceFirstClass DECIMAL(10, 2) NOT NULL,
  priceStanding   DECIMAL(10, 2) NOT NULL,
  pid             CHAR(5) NOT NULL,
  PRIMARY KEY (fid, deptTime),
  FOREIGN KEY (dept) REFERENCES Airport (aid),
  FOREIGN KEY (arr) REFERENCES Airport (aid),
  FOREIGN KEY (pid) REFERENCES Airplane (pid)
);

CREATE TABLE OnFlight (
  fid      CHAR(6),
  deptTime DATETIME,
  aliasId  integer,
  seatNo   integer,
  PRIMARY KEY (fid, deptTime, aliasId),
  FOREIGN KEY (fid, deptTime) REFERENCES Flight (fid, deptTime)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
  FOREIGN KEY (aliasId) REFERENCES Alias (aliasId)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  UNIQUE (fid, deptTime, seatNo)
);

CREATE TABLE FlightReview (
  fid      CHAR(6),
  deptTime DATETIME,
  aliasId  integer,
  postDate DATE,
  text     TEXT,
  PRIMARY KEY (fid, deptTime, aliasId),
  FOREIGN KEY (fid, deptTime) REFERENCES Flight (fid, deptTime)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
  FOREIGN KEY (aliasId) REFERENCES Alias (aliasId)
    on UPDATE CASCADE
    ON DELETE NO ACTION
);

CREATE TABLE Extra (
  oid    integer,
  optionTitle VARCHAR(50),
  optionText  TEXT,
  price       DECIMAL(10, 2),
  PRIMARY KEY (oid)
);

Create TABLE OnFlightExtra(
    oid integer,
    fid CHAR(6),
    deptTime DATETIME,
    PRIMARY KEY (fid, deptTime, oid),
    FOREIGN Key (fid, deptTime) REFERENCES Flight (fid, deptTime)
        on DELETE CASCADE
        on UPDATE CASCADE,
    FOREIGN Key (oid) REFERENCES Extra(oid)
);

CREATE TABLE Reservations(
    fid         CHAR(6),
    deptTime    DATETIME,
    aliasId     INTEGER,
    oid         INTEGER,
    PRIMARY KEY (fid,deptTime,aliasId),
    FOREIGN KEY (fid,deptTime,aliasId) REFERENCES  OnFlight (fid,deptTime,aliasId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (fid,deptTime,oid)     REFERENCES  OnFlightExtra (fid,deptTime,oid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Cart (
  cno        CHAR(5),
  fid        CHAR(6),
  deptTime   DATETIME,
  oid   integer,
  seatSelect integer,
  PRIMARY KEY (cno, fid, deptTime, oid),
  FOREIGN KEY (cno) REFERENCES Customer (cno)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (fid, deptTime) REFERENCES Flight (fid, deptTime)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (fid, deptTime, oid) REFERENCES OnFlightExtra (fid, deptTime, oid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TRIGGER ofeDefault
    AFTER INSERT ON Flight
    FOR EACH ROW
    INSERT INTO OnFlightExtra VALUE (0,NEW.fid,NEW.deptTime);

INSERT INTO Extra VALUES (0,null,null,null );
INSERT INTO Airport VALUES ('YLW','CAN','Kelowna','BC','5533 Airport Way','Kelowna International Airport','INTL','1');
INSERT INTO Airport VALUES ('YVR','CAN','Vancouver','BC','3211 Grant McConachie Way', 'Vancouver International Airport','INTL','5');

#AirplaneModel
INSERT INTO AirplaneModel VALUES ('BO747',300,30,0,'Boeing',4,6,"This plane is a beautiful plane, best plane their is. 300 seats with minimal leg room, no room for standing because too much leg room");
INSERT INTO AirplaneModel VALUES ('E0001',0,0,100,'Planes R Us',0,0,'You can fit 100 people standing on this plane. That is all. Flies 50% of the time!');
INSERT INTO AirplaneModel VALUES ('BO787', 500, 80,0, 'Boeing', 10,4,'Carbon fibre hull, fanciest material. Best plane in fleet by far. Flies 100% of the time!');

#Airplane
INSERT INTO Airplane VALUES ('BO747','2016-05-12','00001');
INSERT INTO Airplane VALUES ('BO747','2006-06-06','00002');

INSERT INTO Airplane VALUES ('BO787','2018-05-12','00003');
INSERT INTO Airplane VALUES ('BO787','2018-06-06','00004');

INSERT INTO Airplane VALUES ('E0001','2017-05-12','00005');
INSERT INTO Airplane VALUES ('E0001','2017-05-13','00006');

INSERT INTO Flight VALUES ('WS0314','YVR','YLW','2019-01-01 14:55:00','2019-01-01 16:00:00','2019-01-01 14:55:00','2019-01-01 16:00:00',500.00,800.00,0.00,'00001');
INSERT INTO Flight VALUES ('WS0317','YVR','YLW','2019-01-01 14:00:00','2019-01-01 16:00:00','2019-01-01 14:55:00','2019-01-01 16:00:00',500.00,800.00,0.00,'00001');
