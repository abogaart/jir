<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.onehippo.cms7</groupId>
  <artifactId>hippo-feature-cms-restyling</artifactId>
  <version>7.10-SNAPSHOT</version>

  <inceptionYear>2014</inceptionYear>

  <name>{{ name }}</name>
  <description>Aggregator pom for all trunks that are touched by the 'CMS Restyling' epic</description>
  <packaging>pom</packaging>

  <modules>
    <module>bccm</module>
    <module>cms</module>
    <module>hippo-theme</module>
    <module>channel-manager</module>
    <module>advanced-search</module>
    <module>hst-config-editor</module>
    <module>demo</module>
    <module>eforms</module>
    <module>targeting</module>
    <module>qa-essentials</module>
    <module>gogreen</module>
    <module>gogreen-enterprise</module>
    <!--<module>bccm</module>-->
  </modules>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-deploy-plugin</artifactId>
        <version>2.8.1</version>
        <configuration>
          <skip>true</skip>
        </configuration>
      </plugin>
    </plugins>
  </build>

</project>
