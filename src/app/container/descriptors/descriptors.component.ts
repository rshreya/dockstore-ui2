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

import { ContainerService } from '../../shared/container.service';
import { FileService } from '../../shared/file.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { WebserviceDescriptorType } from '../../shared/models/DescriptorType';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { GA4GHService, ToolFile } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolDescriptorService } from './tool-descriptor.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [ToolDescriptorService],
  styleUrls: ['./descriptors.component.scss']
})

export class DescriptorsComponent extends EntryFileSelector {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
  }

  protected entryType: ('tool' | 'workflow') = 'tool';

  constructor(private containerService: ContainerService,
    private descriptorsService: ToolDescriptorService, protected gA4GHFilesService: GA4GHFilesService,
    private gA4GHFilesQuery: GA4GHFilesQuery, public fileService: FileService, protected gA4GHService: GA4GHService) {
    super(fileService, gA4GHFilesService, gA4GHService);
    this.published$ = this.containerService.toolIsPublished$;
  }

  getDescriptors(version): Array<any> {
    return this.descriptorsService.getDescriptors(this._selectedVersion);
  }

  /**
   * Get all the language-specific primary and secondary descriptors
   *
   * @param {WebserviceDescriptorType} descriptor The descriptor language selected
   * @returns {Observable<Array<ToolFile>>} The array of language-specific descriptors
   * @memberof DescriptorsComponent
   */
  getFiles(descriptorType: WebserviceDescriptorType): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
    ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }
}
