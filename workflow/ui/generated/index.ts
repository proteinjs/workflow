/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@brentbahry/util';
import '@mui/icons-material';
import '@mui/material';
import '@proteinjs/db';
import '@proteinjs/ui';
import '@proteinjs/workflow-common';
import 'react';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[],\"edges\":[]}";


/** Generate Source Links */


const sourceLinks = {
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';