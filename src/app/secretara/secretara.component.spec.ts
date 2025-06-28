import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaraComponent } from './secretara.component';

describe('SecretaraComponent', () => {
  let component: SecretaraComponent;
  let fixture: ComponentFixture<SecretaraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretaraComponent]
    });
    fixture = TestBed.createComponent(SecretaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
