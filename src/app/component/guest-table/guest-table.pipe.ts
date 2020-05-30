import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'guestTable'
})
export class GuestTablePipe implements PipeTransform {


  transform(list: any[], value: string) {
    // If there's a value passed (male or female) it will filter the list otherwise it will return the original unfiltered list.
    return value ? list.filter(x => x.name.toLowerCase().includes(value.toLowerCase())) : list;
  }

}
