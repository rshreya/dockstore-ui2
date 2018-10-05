/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { FileService } from '../../shared/file.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { WebserviceDescriptorType } from '../../shared/models/DescriptorType';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolFile } from '../../shared/swagger';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowDescriptorService } from './workflow-descriptor.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})
export class DescriptorsWorkflowComponent extends EntryFileSelector {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }

  protected entryType: ('tool' | 'workflow') = 'workflow';

  public descriptorPath: string;
  constructor(private workflowDescriptorService: WorkflowDescriptorService, public gA4GHService: GA4GHService,
    public fileService: FileService, protected gA4GHFilesService: GA4GHFilesService,
    private workflowService: WorkflowService, private gA4GHFilesQuery: GA4GHFilesQuery) {
    super(fileService, gA4GHFilesService, gA4GHService);
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.workflowDescriptorService.getDescriptors(this._selectedVersion);
  }

  /**
   * Get all the primary or secondary descriptors
   *
   * @param {*} descriptor  This actually doesn't matter for the workflow components.
   * Both tool and workflows uses the same abstract method, but only tool can have multiple descriptor types.
   * Workflows won't use this until it also supports having multiple descriptor types.
   * @returns {Observable<Array<ToolFile>>}  The array of primary or secondary descriptor ToolFiles
   * @memberof DescriptorsWorkflowComponent
   */
  getFiles(descriptorType: WebserviceDescriptorType): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
    ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }
}
