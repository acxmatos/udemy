using System;
using NUnit.Framework;
using OpenQA.Selenium;

namespace SeleniumParallelTest
{
    [TestFixture]
    [Parallelizable]
    public class FirefoxTesting : Hooks
    {
        public FirefoxTesting() : base(BrowserType.Firefox) { }

        [Test]
        public void FirefoxGoogleTest()
        {
            Driver.Navigate().GoToUrl("https://www.google.com");
            Driver.FindElement(By.Name("q")).SendKeys("Selenium");
            System.Threading.Thread.Sleep(20000);
            Driver.FindElement(By.Name("btnK")).Click();
            Assert.That(Driver.PageSource.Contains("Selenium"),
                Is.EqualTo(true),
                "The text Selenium does not exist!");
        }
    }
}
