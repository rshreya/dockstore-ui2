import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { HeaderModule } from '../shared/header.module';
import { SelectModule } from '../shared/select.module';
import { ListWorkflowsModule } from '../shared/list-workflows.module';
import { TabsModule } from '../shared/tabs.module';
import { DescriptorsModule } from '../shared/descriptors.module';
import { ParamfilesModule } from '../shared/paramfiles.module';

import { WorkflowService } from './workflow/workflow.service';

import { workflowsRouting } from './workflows.routing';

import { WorkflowsComponent } from './workflows.component';
import { SearchWorkflowsComponent } from './search/search.component';
import { WorkflowComponent } from './workflow/workflow.component';

import { VersionsWorkflowComponent } from './versions/versions.component';
import { ViewWorkflowComponent } from './view/view.component';
import { FilesWorkflowComponent } from './files/files.component';

import { DescriptorsWorkflowComponent } from './descriptors/descriptors.component';
import { ParamfilesWorkflowComponent } from './paramfiles/paramfiles.component';

@NgModule({
  declarations: [
    WorkflowsComponent,
    SearchWorkflowsComponent,
    WorkflowComponent,
    VersionsWorkflowComponent,
    ViewWorkflowComponent,
    FilesWorkflowComponent,
    DescriptorsWorkflowComponent,
    ParamfilesWorkflowComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListWorkflowsModule,
    TabsModule,
    DescriptorsModule,
    ParamfilesModule,
    workflowsRouting
  ],
  providers: [
    HighlightJsService,
    WorkflowService
  ]
})
export class WorkflowsModule { }
