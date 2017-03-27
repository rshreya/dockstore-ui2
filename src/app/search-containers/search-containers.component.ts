import { Component, OnInit, Input } from '@angular/core';

import { ContainersService } from './containers.service';

@Component({
  selector: 'app-search-containers',
  templateUrl: './search-containers.component.html',
  styleUrls: ['./search-containers.component.css'],
  providers: [ContainersService]
})
export class SearchContainersComponent implements OnInit {

  dOptions = {};
  displayTable: boolean = false;

  publishedTools = [];

  constructor(private containersService: ContainersService) { }

  getFilteredDockerPullCmd(path: string): string {
    return this.containersService.getDockerPullCmd(path);
  }

  ngOnInit() {
    this.containersService.getPublishedTools()
      .subscribe(
        (publishedTools) => {
          publishedTools.map( tool => {
            var gitUrl = tool.gitUrl;

            tool.provider = this.containersService.getProvider(gitUrl);
            tool.providerUrl = this.containersService.getProviderUrl(gitUrl, tool.provider);

            return tool;
          });
          this.publishedTools = publishedTools;

          this.dOptions = this.publishedTools;
          this.displayTable = true;
        }
      );
  }

}