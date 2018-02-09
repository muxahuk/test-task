require('dotenv').config({
    path: process.env.DOTENV_PATH || ''
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);

const mockDb = require('mock-knex');
const knex = require('../database').knex;
mockDb.mock(knex);

global.expect = chai.expect;
global.sinon = require('sinon');
global.getTracker = mockDb.getTracker;
global.supertest = require('supertest');
