int sensorPin = A0;    // select the input pin
int sensorValue = 0;  // variable to store the value coming from the sensor
int ledPin = 13;      // select the pin for the LED

float t = -100.0;
String string1 = String("Voltage:  ");
String string2 = String(t);
String string3 = String(string1 + string2);
int i = 70;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  //digitalWrite(ledPin, LOW);
  Serial.println(string2);
  delay(1000);
  sensorValue = analogRead(sensorPin);
  string2=String(sensorValue);
  //string3 = String(string1 + string2);
  
    
  if(i==84) {  //T for "TRUE" ASCII code 84 DEC
    digitalWrite(ledPin, HIGH);
  } else if(i==70) { //F for "FALSE" ASCII code 70 DEC
    digitalWrite(ledPin, LOW);
  }
  i = Serial.read();
}
