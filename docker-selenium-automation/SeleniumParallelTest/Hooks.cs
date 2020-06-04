using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Remote;
using System;

namespace SeleniumParallelTest
{
    public enum BrowserType
    {
        Chrome,
        Firefox,
        IE
    }

    [TestFixture]
    public class Hooks : Base
    {
        private readonly Uri _seleniumGridUrl = new Uri("http://localhost:4446/wd/hub");
        private readonly BrowserType _browserType;

        public Hooks(BrowserType browserType)
        {
            _browserType = browserType;
        }

        [SetUp]
        public void InitializeTest()
        {
            // For local running
            //
            //switch(_browserType)
            //{
            //    case BrowserType.Chrome:
            //        Driver = new ChromeDriver();
            //        break;
            //    case BrowserType.Firefox:
            //        Driver = new FirefoxDriver();
            //        break;
            //    default:
            //        throw new NotSupportedException("Not supported yet!");
            //}
            //
            // For remote (Selenium Grid) running
            //
            switch(_browserType)
            {
                case BrowserType.Chrome:
                    var optChrome = new ChromeOptions();
                    //optChrome.AddAdditionalCapability("version", "");
                    //optChrome.AddAdditionalCapability("platform", "LINUX");
                    Driver = new RemoteWebDriver(_seleniumGridUrl, optChrome);
                    break;

                case BrowserType.Firefox:
                    var optFF = new FirefoxOptions();
                    //optFF.AddAdditionalCapability("version", "");
                    //optFF.AddAdditionalCapability("platform", "LINUX");
                    Driver = new RemoteWebDriver(_seleniumGridUrl, optFF);
                    break;

                default:
                    throw new NotSupportedException("Not supported yet!");
            }
        }
    }
}
