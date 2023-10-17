import React from 'react';
import { Loadable, SourceRepository } from '@brentbahry/reflection';

export const getPages = () => SourceRepository.get().objects<Page>('@proteinjs/ui/Page');

export interface Page extends Loadable {
    name: string;
    path: string|string[];
    component: React.ComponentType<{ urlParams: {[key: string]: string} }>;
    /** Render component on its own without any additional, top-level container */
    noPageContainer?: boolean;
    /** If true, page does not require user to be logged in or have any roles. If blank, defaults to false. */
    public?: boolean;
    /** User must be logged in and have these roles to access page. If blank, defaults to requiring 'admin' role. */
    roles?: string[];
}